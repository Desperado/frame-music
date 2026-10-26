import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { build } from 'esbuild';
import { privateIPv4 } from '../app/protocol.js';

// Ship a classic script: packaged TV widgets need not load ES modules from file URLs.
export async function buildApp(defaultHost = '') {
  if (defaultHost !== '' && !privateIPv4(defaultHost)) throw new Error('The Yamaha preset must be a private IPv4 address.');
  const shared = await build({
    stdin: { contents: "export { createTVPeerController } from './peer-controller'; export { beginPeerPairing, beginQRPairing, createPeerInvitation, validPeer } from './peer'; export { privateIPv4 } from './parsers'; export { discoverPeers } from './discovery'; export { canBrowseSource } from './browsing'; export { parsePlayQueue } from './play-queue'; export { default as qrcode } from 'qrcode-generator'; export { en, uk } from '../../../app/pairing-copy.js';", resolveDir: fileURLToPath(new URL('../packages/musiccast/src/', import.meta.url)), loader: 'ts' },
    bundle: true, format: 'iife', globalName: 'companionAPI', target: 'chrome85', write: false,
  });
  const files = ['companion.js', 'protocol.js', 'metadata.js', 'artist-scene.js', 'demo.js', 'app.js'];
  const sources = await Promise.all(files.map(name => readFile(new URL(`../app/${name}`, import.meta.url), 'utf8')));
  return `(async function () {\n'use strict';\nconst bundledYamahaHost = ${JSON.stringify(defaultHost)};\n${shared.outputFiles[0].text}\nconst qrcode = companionAPI.qrcode; const { en, uk } = companionAPI;\n${sources.map(source => source.replace(/^import .+ from .+;\n/gm, '').replace(/^export /gm, '')).join('\n')}\n})();\n`;
}

export async function stageLicenses(destination = new URL('../app/', import.meta.url)) {
  await mkdir(new URL('licenses/', destination), { recursive: true });
  for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
    await copyFile(new URL(`../${name}`, import.meta.url), new URL(name, destination));
  }
  await copyFile(new URL('../licenses/qrcode-generator.txt', import.meta.url), new URL('licenses/qrcode-generator.txt', destination));
  await copyFile(new URL('../packages/musiccast/LICENSE', import.meta.url), new URL('licenses/mosaicast-MIT.txt', destination));
  for (const name of ['ciphers', 'curves', 'hashes']) {
    await copyFile(new URL(`../node_modules/@noble/${name}/LICENSE`, import.meta.url), new URL(`licenses/noble-${name}-MIT.txt`, destination));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { 'yamaha-host': { type: 'string', default: '' } } });
  await writeFile(new URL('../app/bundle.js', import.meta.url), await buildApp(values['yamaha-host']));
  await stageLicenses();
  console.log('Built app/bundle.js for browser and Tizen.');
}
