import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { privateIPv4 } from '../app/protocol.js';

// Ship a classic script: packaged TV widgets need not load ES modules from file URLs.
export async function buildApp(defaultHost = '') {
  if (defaultHost !== '' && !privateIPv4(defaultHost)) throw new Error('The Yamaha preset must be a private IPv4 address.');
  const files = ['protocol.js', 'metadata.js', 'artist-scene.js', 'demo.js', 'app.js'];
  const sources = await Promise.all(files.map(name => readFile(new URL(`../app/${name}`, import.meta.url), 'utf8')));
  return `(async function () {\n'use strict';\nconst bundledYamahaHost = ${JSON.stringify(defaultHost)};\n${sources.map(source => source.replace(/^import .+ from .+;\n/gm, '').replace(/^export /gm, '')).join('\n')}\n})();\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { 'yamaha-host': { type: 'string', default: '' } } });
  await writeFile(new URL('../app/bundle.js', import.meta.url), await buildApp(values['yamaha-host']));
  for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
    await copyFile(new URL(`../${name}`, import.meta.url), new URL(`../app/${name}`, import.meta.url));
  }
  console.log('Built app/bundle.js for browser and Tizen.');
}
