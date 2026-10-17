# Third-party notices and project relationships

Frame Music's original source, documentation, app icon, receiver illustration, illustrated demo cover, demo lyrics and orbital artwork are covered by the root [MIT License](LICENSE). The owner confirmed that these were created for this project; see [provenance](PROVENANCE.md). Third-party materials below keep their own licenses and rights. Linking to a project or calling its API does not relicense that project's code or content.

## Code, services and references

| Project | How it is used | Upstream license / source | Shipped here? |
| --- | --- | --- | --- |
| [pyamaha](https://github.com/rsc-dev/pyamaha) by Radoslaw [roscoe] Matusiak and contributors | Existing README protocol reference for Yamaha Extended Control; `app/protocol.js` implements the subset this app needs in JavaScript. | [MIT](https://github.com/rsc-dev/pyamaha/blob/master/LICENSE); [API documentation](https://github.com/rsc-dev/pyamaha/tree/master/doc) | No Python package or vendored pyamaha source. |
| [LRCLIB](https://github.com/tranxuanthang/lrclib) by tranxuanthang and contributors | `app/metadata.js` calls the public lyrics lookup endpoint. | Server code: [MIT](https://github.com/tranxuanthang/lrclib/blob/main/LICENSE); [API documentation](https://lrclib.net/docs) | API responses at runtime only; no server code or lyrics database. |
| [Node.js](https://github.com/nodejs/node) contributors | Node built-ins power `scripts/` and `test/`; Node 22 or newer is required for development and preview. | [MIT plus bundled third-party notices](https://github.com/nodejs/node/blob/main/LICENSE) | Installed separately; not in the TV package. |
| [Tizen](https://www.tizen.org/) | Target web application platform; `app/config.xml` declares the Samsung TV profile and `app/app.js` uses remote-key/application APIs. | [Platform and application documentation](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html); platform, SDK and firmware terms are separate from this app's MIT license. | Runtime and SDK installed separately; no platform source is vendored. |
| [actions/checkout](https://github.com/actions/checkout) | Checks out the repository in GitHub CI. | [MIT](https://github.com/actions/checkout/blob/main/LICENSE) | CI reference only. |
| [actions/setup-node](https://github.com/actions/setup-node) | Selects Node.js in GitHub CI. | [MIT](https://github.com/actions/setup-node/blob/main/LICENSE) | CI reference only. |

There is no frontend framework. Runtime dependencies are bundled into the generated classic TV script; no CDN is used.

| Code / version | Purpose | License / distribution |
| --- | --- | --- |
| Mosaicast `@mosaicast/musiccast` 0.1.0, revision `bb7372b71a69fb75df28b7bb76afa2d2e740f1b0` | Vendored local device adapter, authenticated phone/TV coordination and QR pairing protocol | MIT, Mosaicast contributors; [source notice](packages/musiccast/LICENSE), [provenance](packages/musiccast/README.md). Used TV code is bundled; tests are development only. |
| [qrcode-generator 2.0.4](https://github.com/kazuhikoarase/qrcode-generator) | Offline QR rendering | MIT, Kazuhiko Arase. Bundled; generated `app/licenses/qrcode-generator.txt` retains the upstream MIT license (blob `150770c0fc2994865ccdbef6662735cc083e780d`). |
| [@noble/ciphers 1.3.0](https://github.com/paulmillr/noble-ciphers), [@noble/curves 1.9.7](https://github.com/paulmillr/noble-curves), [@noble/hashes 1.8.0](https://github.com/paulmillr/noble-hashes) | Authenticated encryption, key exchange and derivation | MIT, Paul Miller and contributors. Used code is bundled; generated `app/licenses/noble-*-MIT.txt` retain the npm licenses. |
| [esbuild 0.28.2](https://github.com/evanw/esbuild) | Bundle the TV script | MIT; development only, installed separately. |
| [TypeScript 6.0.3](https://github.com/microsoft/TypeScript) | Check and compile the vendored package | Apache-2.0; development only, installed separately. |

`npm run build` copies the shipped MIT notices into `app/licenses/`, including `mosaicast-MIT.txt`. Keep these files in the packaged widget. API endpoint names and device capabilities describe interoperability with Yamaha hardware.

## Bundled fonts

All seven font files were obtained from the official [Google Fonts `ofl/` directory](https://github.com/google/fonts/tree/main/ofl) on 2026-10-17. They are unmodified apart from local filenames. Each retains its original copyright notice and full SIL Open Font License 1.1 (SPDX: `OFL-1.1`).

| Local font | Upstream project / copyright holder | Local license |
| --- | --- | --- |
| `app/fonts/Archivo.ttf` | [Archivo](https://github.com/Omnibus-Type/Archivo), © 2020 The Archivo Project Authors | [archivo-OFL.txt](app/fonts/archivo-OFL.txt) |
| `app/fonts/Caprasimo.ttf` | [Caprasimo](https://github.com/docrepair-fonts/caprasimo-fonts), © 2023 The Caprasimo Project Authors | [caprasimo-OFL.txt](app/fonts/caprasimo-OFL.txt) |
| `app/fonts/Figtree.ttf` | [Figtree](https://github.com/erikdkennedy/figtree), © 2022 The Figtree Project Authors | [figtree-OFL.txt](app/fonts/figtree-OFL.txt) |
| `app/fonts/InstrumentSans.ttf` | [Instrument Sans](https://github.com/Instrument/instrument-sans), © 2022 The Instrument Sans Project Authors | [instrumentsans-OFL.txt](app/fonts/instrumentsans-OFL.txt) |
| `app/fonts/InstrumentSerif.ttf` | [Instrument Serif](https://github.com/Instrument/instrument-serif), © 2022 The Instrument Serif Project Authors | [instrumentserif-OFL.txt](app/fonts/instrumentserif-OFL.txt) |
| `app/fonts/IBMPlexSans.ttf` | [IBM Plex](https://github.com/IBM/plex), © 2017 IBM Corp.; reserved font name “Plex” | [ibmplexsans-OFL.txt](app/fonts/ibmplexsans-OFL.txt) |
| `app/fonts/IBMPlexMono.ttf` | [IBM Plex](https://github.com/IBM/plex), © 2017 IBM Corp.; reserved font name “Plex” | [ibmplexmono-OFL.txt](app/fonts/ibmplexmono-OFL.txt) |

See [font provenance](app/fonts/README.md) for the exact Google Fonts paths. Preserve each font's license and copyright notice when redistributing it. Font modifications must follow the OFL, including any reserved font names; the fonts are not relicensed under MIT.

## Device platforms, brands and media

- **Samsung / Tizen:** the TV app uses the platform's web application and remote-key APIs. Samsung's SDK, certificate tooling and TV firmware are installed separately and are not distributed here. See the [Samsung TV developer documentation](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html).
- **Yamaha / MusicCast:** the app sends local Yamaha Extended Control requests. Device firmware, MusicCast apps, accounts and streaming integrations are separate products. The app uses an original generic receiver illustration. Private development history used an official Yamaha logo without documented redistribution permission. The public repository starts with a clean source snapshot excluding that asset and the private history; see [publication provenance](app/assets/README.md). Attribution alone is not permission.
- **Deezer and other music services:** names identify services reported by the Yamaha. No provider SDK, account credentials, music recordings or subscription access is bundled. Service availability and use remain subject to the provider's terms.
- **Lyrics and album covers:** live lyrics come from LRCLIB and covers from the connected Yamaha. Their underlying copyrights remain with their rights holders. LRCLIB's server-code license does not establish a license for the lyrics it returns. These runtime materials are excluded from Frame Music's MIT grant; do not commit or redistribute fetched content without the relevant rights.

There is no claim of endorsement by these projects or vendors. The MIT license grants no rights to third-party trademarks.

## Keeping this inventory current

When adding a dependency, copied snippet, font, image, icon, service or build tool, record its upstream URL, version or source revision when available, purpose, license and whether it is bundled. Include the required license text and copyright notices for redistributed material. Check compatibility before merging. Keep this file and the README relationship table in sync.
