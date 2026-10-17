# Contributing to Frame Music

Bug reports, documentation improvements, device compatibility reports and focused pull requests are welcome. Ruslan Strazhnyk ([@Desperado](https://github.com/Desperado)) maintains the project and reviews changes. Open an issue before starting a large feature so its scope can be agreed. This is a community project without a support SLA or guaranteed device coverage.

## Development

Use Node.js 22 or newer. Install pinned packages with `npm ci`. No account, API key or hardware is required for the simulated tests and preview.

```sh
npm ci
npm run check
npm run bundle:check
npm start
```

Open http://127.0.0.1:4173 for Preview mode. See the [README](README.md) for connecting hardware and installing on a TV. `app/bundle.js`, `app/LICENSE` and `app/THIRD_PARTY_NOTICES.md` and `app/licenses/` are generated and ignored; edit the source modules and root notices instead. `package.json` intentionally has `private: true` to prevent accidental npm publication; source licensing is defined by [LICENSE](LICENSE).

## Issues and pull requests

- Search [existing issues](https://github.com/Desperado/frame-music/issues). For bugs, include expected and actual behavior, reproduction steps, app revision, Node/browser or TV version, and relevant Yamaha model/firmware. Remove personal device identifiers and network details.
- Keep pull requests focused. Explain the user-visible change, tests run and any hardware checks still needed. Add a regression test for a behavior fix, and update documentation when behavior changes.
- Run `npm run check` and `npm run bundle:check`. UI changes should be checked in Preview mode with arrow keys, Enter and Back/Escape, including dialogs, empty states and themes. State exactly which physical devices were tested; simulated tests do not establish TV compatibility.
- Preserve the local-only preview server, host and route validation, serialized device requests, text-only rendering of device/lyrics content and safeguards against unwanted playback. Never make automated tests depend on live devices, public providers or account credentials.
- When testing hardware, get the device owner's agreement before changing power, input, playback, volume or mute. Restore the original state when practical and describe the checks performed.

## Licensing and provenance

By submitting a contribution, you agree to provide your original contribution under this project's MIT license. You retain your copyright. No copyright assignment or separate contributor agreement is required. Only submit work you have the right to contribute.

For third-party code or assets, provide the upstream source and applicable license, retain required notices, and update [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Do not assume publicly downloadable material is open source. The bundled fonts retain OFL-1.1. Do not submit vendor logos, fetched lyrics, album covers or artist photos without redistribution rights.

## Privacy and conduct

Do not commit credentials, `.env` files, signing certificates, private keys, personalised bundles or packages, device dumps or unredacted logs. Screenshots and fixtures must use invented data or appropriately licensed examples. See [SECURITY.md](SECURITY.md) for private vulnerability reporting and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for community expectations.
