# Mosaicast integration provenance

Imported from [Desperado/mosaicast](https://github.com/Desperado/mosaicast) at
[`5f6358609f84db45a258ed8c24c206346d7099e3`](https://github.com/Desperado/mosaicast/commit/5f6358609f84db45a258ed8c24c206346d7099e3),
after the paired Frame integration (PR #12) and Bluetooth support (PR #13) merged.

## Imported scope

- `apps/frame/app/companion.js`, its connected UI, themes, manifest and tests.
- The Frame classic-script build and preview-server changes.
- The complete `packages/musiccast` source, tests and package configuration.
- Pinned cryptography/build dependencies in the root workspace and lockfile.
- The companion setup guide, adapted to this standalone TV repository.

The source Frame app already included this repository's presentation work:
themes, glass/solid surfaces, artist atmosphere, Help, quiet labels and held-arrow
navigation. This port also retains the later Clear appearance and continuous held-arrow fixes.
Public assets, fonts and their notices are retained, including the original generic
receiver illustration; no Yamaha logo or private Git history is imported.

Local adaptations change import/build paths and workspace scripts, name the pairing
storage identifier explicitly, and stage runtime dependency licenses in the widget. The TV UI also
keeps both its active client and a connection in progress inactive while hidden;
closing a dialog cannot reactivate background coordination. Regression coverage
uses the real encrypted phone service with synthetic pairing data.

## Compatibility

`packages/musiccast/src`, its tests, `package.json` and `tsconfig.json` are copied
verbatim from the pinned commit. Keep them synchronized with Mosaicast when
updating. Do not copy only peer transport files: command validation, Bluetooth
state, coordinator behavior, leases and uncertainty handling form one protocol.
No React Native dependencies are imported. Generated `dist/` and `app/bundle.js`
are ignored and rebuilt locally. No native phone app is produced by this port. Signed TV widgets are generated
locally with Tizen tooling and are not committed.

Imported Mosaicast code is MIT licensed; its full notice is retained in
[`packages/musiccast/LICENSE`](../packages/musiccast/LICENSE). That notice also
covers the imported Frame adapter/build/UI changes. Existing third-party asset
licenses still apply. Hardware validation is tracked separately in
[the acceptance checklist](companion-validation.md).
