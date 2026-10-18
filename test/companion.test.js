import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import api from '../packages/musiccast/dist/index.js';
import { parseFeatures } from '../packages/musiccast/dist/parsers.js';
import { deviceCapabilities, sources } from '../app/protocol.js';
import { FrameCompanion, companionFeatures, companionTuner, pairFrame, frameInvitation, savedCompanion, frameNetworkAddress, findFrameCompanions } from '../app/companion.js';

const snapshot = () => ({ model: 'Fixture', features: { controls: ['power', 'volume', 'mute'], connectivity: [], sources: [{ id: 'deezer', name: 'Deezer', networkPlayer: true }, { id: 'tuner', name: 'Radio', networkPlayer: false, tuner: true }], volumeRange: { min: 0, max: 20, step: 1 } }, status: { power: 'on', input: 'deezer', volume: 10, mute: false }, track: { title: 'Fixture song', artist: '', album: '', playback: 'pause' }, trackUnavailable: false });

const random = n => new Uint8Array(randomBytes(n));
test('paired browsing follows phone support while preserving input selection and network playback', () => {
  const ids = ['deezer', 'server', 'usb', 'net_radio', 'napster', 'juke', 'qobuz', 'tidal', 'spotify'];
  const raw = { system: { input_list: ids.map(id => ({ id, play_info_type: 'netusb' })) }, zone: [{ id: 'main', input_list: ids }] };
  const paired = sources(companionFeatures({ features: parseFeatures(raw) }));
  assert.deepEqual(paired.map(source => source.id), ids);
  assert.deepEqual(paired.filter(source => source.browse).map(source => source.id), ['deezer', 'server', 'usb', 'net_radio']);
  assert.ok(paired.every(source => source.type === 'netusb'));
  assert.ok(paired.filter(source => !source.browse).every(source => !source.description.startsWith('Browse')));
  assert.deepEqual(sources(raw).filter(source => source.browse).map(source => source.id), ids.slice(0, -1));
});

test('paired capabilities preserve parsed connectivity labels without inventing unsupported features', () => {
  const raw = { system: { func_list: ['wired_lan', 'wireless_lan', 'wireless_direct', 'airplay', 'bluetooth_tx_setting', 'network_standby'], input_list: [{ id: 'deezer', play_info_type: 'netusb' }] }, zone: [{ id: 'main', input_list: ['deezer'], func_list: ['power', 'volume', 'mute'] }] };
  const features = parseFeatures(raw);
  features.connectivity.push('Unknown connection');
  assert.deepEqual(deviceCapabilities(companionFeatures({ features })), deviceCapabilities(raw));
  features.connectivity = [];
  assert.deepEqual(deviceCapabilities(companionFeatures({ features })), ['Power control', 'Volume', 'Mute']);
});

const url = 'http://192.168.1.10:8095';
function service(coordinator, record, persist = async () => {}) {
  const phone = new api.PhonePeerService('192.168.1.20', url, coordinator, random, record, persist);
  return { phone, fetcher: async (address, options = {}) => {
    const value = await phone.handle(options.method || 'GET', new URL(address).pathname, options.body ? JSON.parse(options.body) : undefined);
    return { ok: true, text: async () => JSON.stringify(value) };
  } };
}

test('TV controls use authenticated semantic operations and never echo observations', async () => {
  let current = snapshot(), writes = 0;
  const coordinator = new api.CompanionCoordinator({ read: async () => current, execute: async command => {
    writes++;
    if (command.type === 'volume') current.status.volume++;
    if (command.type === 'input') current.status.input = command.value;
    return current;
  } }, 'fixture');
  const record = { url, receiver: '192.168.1.20', id: randomBytes(16).toString('hex'), key: randomBytes(32).toString('hex') };
  const { fetcher } = service(coordinator, record), priorFetch = globalThis.fetch;
  globalThis.fetch = fetcher;
  const tv = new FrameCompanion(record);
  try {
    await tv.request('system/getFeatures'); await tv.request('main/getStatus'); assert.equal(writes, 0);
    await assert.rejects(tv.sound('up'), /Refresh/); await tv.reconcile();
    assert.equal((await tv.sound('up')).volume, 11); assert.equal(writes, 1);
    current.status.volume = 17; await coordinator.poll();
    assert.equal((await tv.request('main/getStatus')).volume, 17); assert.equal(writes, 1);
    await assert.rejects(tv.request('main/setVolume', { volume: 99 }), /Unsupported/); assert.equal(writes, 1);
    await tv.selectInput('tuner'); assert.equal(writes, 2);
    await assert.rejects(tv.request('netusb/setPlayback', { playback: 'stop' }), /Use Pause/);
  } finally { tv.close(); globalThis.fetch = priorFetch; }
});

function keyStore() {
  const data = new Map();
  const missing = () => Object.assign(new Error('Missing'), { name: 'NotFoundError' });
  return { data, manager: {
    getData({ name }) { if (!data.has(name)) throw missing(); return data.get(name); },
    removeData({ name }) { if (!data.delete(name)) throw missing(); },
    saveData(name, raw, _password, success) { data.set(name, raw); success(); },
  } };
}
function freshService(persist) { return service(new api.CompanionCoordinator({ read: async () => snapshot() }, 'fixture'), undefined, persist); }

test('TV verifies its durable record before the phone saves; explicit retry recovers a lost reply', async () => {
  const priorFetch = globalThis.fetch, priorTizen = globalThis.tizen;
  const store = keyStore(); let saves = 0, loseReply = false;
  const { phone, fetcher } = freshService(async record => {
    assert.ok(savedCompanion()?.key === record.key); saves++;
  });
  try {
    globalThis.tizen = { keymanager: store.manager };
    globalThis.fetch = async (...args) => { const reply = await fetcher(...args); if (loseReply && String(args[0]).endsWith('/peer/pair/confirm')) { loseReply = false; throw new Error('Lost reply'); } return reply; };
    const pending = await pairFrame(url);
    assert.ok(pending.comparison === phone.pairing.comparison);
    await assert.rejects(pending.confirm(), /phone has not confirmed/); assert.equal(saves, 0);
    phone.approve(); loseReply = true;
    await assert.rejects(pending.confirm(), /phone has not confirmed/); assert.equal(saves, 1);
    const record = await pending.confirm(); assert.equal(saves, 1);
    assert.ok(savedCompanion()?.key === record.key);
    assert.equal(store.data.size, 1);
  } finally { globalThis.fetch = priorFetch; globalThis.tizen = priorTizen; }
});

test('failed TV writes and readback preserve the previous pair and never save on the phone', async () => {
  const priorFetch = globalThis.fetch, priorTizen = globalThis.tizen;
  const store = keyStore(); let saves = 0;
  const old = { url, receiver: '192.168.1.20', id: randomBytes(16).toString('hex'), key: randomBytes(32).toString('hex') };
  store.data.set('mosaicast-peer-v1', JSON.stringify(old));
  try {
    globalThis.tizen = { keymanager: store.manager };
    const first = freshService(async () => { saves++; }); globalThis.fetch = first.fetcher;
    const pending = await pairFrame(url); first.phone.approve();
    const save = store.manager.saveData;
    store.manager.saveData = (_name, _raw, _password, _success, fail) => fail({ name: 'UnknownError' });
    await assert.rejects(pending.confirm(), /Could not save/);
    assert.ok(savedCompanion()?.key === old.key); assert.equal(saves, 0);
    store.manager.saveData = (_name, _raw, _password, success) => success();
    await assert.rejects(pending.confirm(), /Could not save/);
    assert.ok(savedCompanion()?.key === old.key); assert.equal(saves, 0);
    store.manager.saveData = save;
    const record = await pending.confirm(); assert.equal(saves, 1);
    assert.ok(savedCompanion()?.key === record.key);
    assert.equal(store.data.has('mosaicast-peer-v1'), true);
    globalThis.tizen = {}; await assert.rejects(pairFrame(url), /Could not save/); assert.equal(savedCompanion(), undefined);
    delete globalThis.tizen;
    const third = freshService(); globalThis.fetch = third.fetcher;
    const preview = await pairFrame(url); third.phone.approve(); const result = await preview.confirm();
    assert.ok(savedCompanion()?.key === result.key);
  } finally { globalThis.fetch = priorFetch; globalThis.tizen = priorTizen; }
});

test('QR pairing saves matching keys without manual codes and survives new service instances', async () => {
  const priorFetch = globalThis.fetch, priorTizen = globalThis.tizen;
  const store = keyStore(); let durable;
  try {
    globalThis.tizen = { keymanager: store.manager };
    const first = freshService(async record => { durable = record; }); globalThis.fetch = first.fetcher;
    const qr = frameInvitation('192.168.1.20');
    assert.equal(qr.image.startsWith('data:image/svg+xml;'), true);
    first.phone.acceptInvitation(qr.text);
    const pending = await pairFrame(url, qr.invitation);
    assert.equal(pending.comparison, undefined);
    const record = await pending.confirm();
    assert.ok(durable.key === record.key && savedCompanion()?.key === record.key);
    const restarted = service(new api.CompanionCoordinator({ read: async () => snapshot() }, 'fixture'), durable);
    globalThis.fetch = restarted.fetcher;
    const tv = new FrameCompanion(savedCompanion());
    try { await tv.reconcile(); assert.equal((await tv.request('main/getStatus')).volume, 10); }
    finally { tv.close(); }
  } finally { globalThis.fetch = priorFetch; globalThis.tizen = priorTizen; }
});

test('FM/DAB controls and presets come only from reported state and capabilities', () => {
  const state = snapshot(); state.status.input = 'tuner';
  assert.equal(companionTuner(state), undefined);
  state.features.tuner = { bands: ['fm'], fmRange: { min: 87500, max: 108000, step: 50 } };
  state.tuner = { band: 'fm', frequency: 99500, station: 'Fixture FM', text: '', ready: true };
  let controls = companionTuner(state).controls;
  assert.equal(controls.filter(c => c.command.type === 'tunerTune').length, 4);
  assert.ok(!controls.some(c => ['tunerPreset', 'tunerScan', 'tunerService'].includes(c.command.type)));
  state.features.tuner = { bands: ['dab'], initialScan: true, presets: { type: 'separate', num: 8 } };
  state.tuner = { band: 'dab', station: 'Fixture DAB', text: '', ready: true, preset: 2, presets: [{ slot: 1, number: 1, band: 'fm' }, { slot: 2, number: 3, band: 'dab' }, { slot: 4, number: 8, band: 'dab' }] };
  controls = companionTuner(state).controls;
  assert.ok(controls.filter(c => c.command.type === 'tunerPreset').every(c => c.command.value === 4));
  assert.ok(controls.some(c => c.command.type === 'tunerScan' && c.command.value === 'start'));
  state.tuner.scanning = true; state.tuner.ready = false;
  controls = companionTuner(state).controls;
  assert.ok(controls.some(c => c.command.type === 'tunerScan' && c.command.value === 'cancel'));
  assert.ok(!controls.some(c => c.command.type === 'tunerService'));
});

test('TV discovery falls back to the active Tizen interface when Samsung network access is unavailable', async t => {
  const priorWebapis = globalThis.webapis, priorTizen = globalThis.tizen;
  t.after(() => { globalThis.webapis = priorWebapis; globalThis.tizen = priorTizen; });
  for (const networkType of ['WIFI', 'ETHERNET']) for (const failure of ['missing', 'throws', 'invalid']) {
    const properties = [];
    globalThis.webapis = failure === 'missing' ? undefined : { network: { getIp() {
      if (failure === 'throws') throw Object.assign(new Error('Unavailable'), { name: 'SecurityError' });
      return '0.0.0.0';
    } } };
    globalThis.tizen = { systeminfo: { getPropertyValue(property, success) {
      properties.push(property);
      success(property === 'NETWORK' ? { networkType } : { status: networkType === 'ETHERNET' ? 'CONNECTED' : 'ON', ipAddress: '192.168.1.30' });
    } } };
    assert.equal(await frameNetworkAddress(), '192.168.1.30');
    assert.deepEqual(properties, ['NETWORK', `${networkType}_NETWORK`]);
    const abort = new AbortController(); abort.abort();
    assert.deepEqual(await findFrameCompanions(abort.signal, () => assert.fail('Cancelled search')), []);
  }
});

test('TV network discovery rejects disconnected, public and unsupported interfaces without guessing a subnet', async t => {
  const priorWebapis = globalThis.webapis, priorTizen = globalThis.tizen;
  t.after(() => { globalThis.webapis = priorWebapis; globalThis.tizen = priorTizen; });
  globalThis.webapis = { network: { getIp: () => '192.168.1.30' } };
  globalThis.tizen = { systeminfo: { getPropertyValue() { assert.fail('Samsung address is already valid'); } } };
  assert.equal(await frameNetworkAddress(), '192.168.1.30');
  globalThis.webapis = undefined;
  for (const adapter of [{ status: 'OFF', ipAddress: '192.168.1.30' }, { status: 'ON', ipAddress: '8.8.8.8' }]) {
    globalThis.tizen = { systeminfo: { getPropertyValue(property, success) {
      success(property === 'NETWORK' ? { networkType: 'WIFI' } : adapter);
    } } };
    await assert.rejects(frameNetworkAddress());
  }
  globalThis.tizen = { systeminfo: { getPropertyValue(_property, _success, error) { error(new Error('Unsupported')); } } };
  await assert.rejects(frameNetworkAddress());
  globalThis.tizen = { systeminfo: { getPropertyValue(_property, success) { success({ networkType: 'NONE' }); } } };
  await assert.rejects(frameNetworkAddress());
  globalThis.tizen = { systeminfo: { getPropertyValue(property, success) {
    success(property === 'NETWORK' ? { networkType: 'ETHERNET' } : { status: 'DISCONNECTED', ipAddress: '192.168.1.30' });
  } } };
  await assert.rejects(frameNetworkAddress());
});

test('TV network lookup times out if the Tizen callback never arrives', async t => {
  const priorWebapis = globalThis.webapis, priorTizen = globalThis.tizen;
  t.after(() => { globalThis.webapis = priorWebapis; globalThis.tizen = priorTizen; });
  t.mock.timers.enable({ apis: ['setTimeout'] });
  globalThis.webapis = undefined;
  globalThis.tizen = { systeminfo: { getPropertyValue() {} } };
  const failed = assert.rejects(frameNetworkAddress(), /Network information unavailable/);
  t.mock.timers.tick(1500);
  await failed;
});
