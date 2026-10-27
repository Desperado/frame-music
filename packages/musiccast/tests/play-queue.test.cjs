const {test} = require('node:test');
const assert = require('node:assert/strict');
const {parsePlayQueue, MusicCastClient} = require('../dist');

test('queue parser preserves absolute indices and filters metadata to display fields', () => {
  assert.deepEqual(parsePlayQueue({index: 8, max_line: 10, playing_index: 9, track_info: [
    {track: 'Song', artist: 'Artist', album: 'Album', unrelated: 'omit'}, {text: 'Second song'}
  ]}, 8), {start: 8, total: 10, playingIndex: 9, tracks: [
    {index: 8, title: 'Song', artist: 'Artist', album: 'Album'}, {index: 9, title: 'Second song', artist: '', album: ''}
  ]});
  assert.deepEqual(parsePlayQueue({max_line: 0}), {start: 0, total: 0, playingIndex: null, tracks: []});
  for (const value of [{}, {max_line: -1}, {max_line: 2, track_info: []}, {max_line: 1, track_info: [], index: 8}]) assert.throws(() => parsePlayQueue(value), /unavailable/);
});

test('large queues and long metadata remain small enough for encrypted companion replies', () => {
  const text = '🎵'.repeat(1000);
  const queue = parsePlayQueue({max_line: 500, track_info: Array.from({length: 500}, () => ({track: text, artist: text, album: text}))});
  assert.equal(queue.total, 500); assert.equal(queue.tracks.length, 8);
  assert.equal(queue.tracks[0].title.length, 512);
  assert.ok(Buffer.byteLength(JSON.stringify(queue)) < 100000);
});

test('unknown or invalid playing positions keep the queue readable without a false highlight', () => {
  for (const playing_index of [undefined, null, -1, 1.5, '0', 5, 99, 65000]) {
    const queue = parsePlayQueue({max_line: 5, playing_index, track_info: [{track: 'Song'}]});
    assert.equal(queue.playingIndex, null);
    assert.equal(queue.total, 5);
    assert.deepEqual(queue.tracks, [{index: 0, title: 'Song', artist: '', album: ''}]);
  }
});

test('queue reads work without browse history and reject standby or non-network inputs', async () => {
  const calls = []; let power = 'on', input = 'deezer';
  const client = new MusicCastClient('192.168.1.20', async value => {
    const url = new URL(value), route = url.pathname.split('/').at(-1); calls.push(route);
    const data = route === 'getFeatures' ? {system: {input_list: [{id: 'deezer', play_info_type: 'netusb'}, {id: 'cd', play_info_type: 'cd'}]}, zone: [{id: 'main', input_list: ['deezer', 'cd']}]} :
      route === 'getStatus' ? {power, input} : {max_line: 1, playing_index: 0, track_info: [{track: 'Cold-start song'}]};
    return new Response(JSON.stringify({response_code: 0, ...data}));
  });
  assert.equal((await client.playQueue()).tracks[0].title, 'Cold-start song');
  assert.deepEqual(calls, ['getFeatures', 'getStatus', 'getPlayQueue']);
  power = 'standby'; await assert.rejects(client.playQueue(), /unavailable/);
  power = 'on'; input = 'cd'; await assert.rejects(client.playQueue(), /unavailable/);
  assert.equal(calls.filter(c => c === 'getPlayQueue').length, 1);
  await assert.rejects(client.playQueue(-1), /Invalid/);
});
