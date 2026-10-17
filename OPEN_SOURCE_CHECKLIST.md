# Open-source publication and release checklist

This checklist covers work outside the source tree as well as release preparation. A checked-in policy does not enable a GitHub setting.

## Initial publication

The owner selected a separate public repository, `Desperado/frame-music`, with a clean source snapshot. The original development repository remains private. Its history, branches, pull requests, issues, attachments, Actions logs and artifacts are not copied to the public repository.

- [ ] Scan the exact source snapshot and its new Git history with a redacting secret scanner before publication. Review the file inventory for signing material, personal/device data and content without redistribution rights. Never print secret values; arrange any required rotation with the credential owner.
- [x] The owner confirmed the right to license the project's original code and artwork under [MIT](LICENSE), and clarified that the only externally obtained artwork was the removed Yamaha logo. The bundled fonts retain separate OFL notices. See [provenance](PROVENANCE.md).
- [x] Replace the official Yamaha logo with original artwork. Exclude the private development history containing the logo from the clean publication. See [third-party notices](THIRD_PARTY_NOTICES.md).
- [x] Review source examples and artwork: app icon, demo cover, demo lyrics and orbital illustration are project material. Exclude fetched lyrics/covers, screenshots, personalised bundles and private device dumps.
- [x] The owner confirmed that the security/conduct contact in [SECURITY.md](SECURITY.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) is monitored.
- [ ] Publish only the reviewed snapshot with the licensing, notices and community files on its default branch. Verify the original repository remains private. Keep npm publication separate.

## GitHub settings

- [ ] Enable Issues and private vulnerability reporting. Verify the private reporting link works from a contributor account.
- [ ] Enable secret scanning and push protection where available. Review alerts privately; do not expose secret values.
- [ ] Enable GitHub Actions with read-only default token permissions, require approval for workflows from new external contributors, and avoid running untrusted PR code with secrets or write permissions. This repository's workflow uses `pull_request`, no deployment secrets and pinned action commits.
- [ ] Protect `master`: require pull requests, review and the `Test and build (22)` / `Test and build (24)` CI checks; block force pushes and deletion. Confirm the actual check names after the first run.
- [ ] Set the repository description and relevant topics (for example `musiccast`, `tizen`, `samsung-tv`, `yamaha`, `javascript`). Verify GitHub detects the MIT license and that README, contribution, conduct and security links resolve.

## For every release

- [ ] Review the change and connected code for correctness, security, device side effects and unnecessary complexity. Run `npm test` and `npm run build` from a clean checkout; require CI success.
- [ ] Test the changed UI with the TV remote or keyboard. Report tested hardware, firmware and browsers, and state any unverified physical-device behavior. CI does not validate signing or installation on a TV.
- [ ] Update [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for new dependencies, copied code, services and assets. Record exact versions or source revisions for new vendored material, check license compatibility and retain required full license texts.
- [ ] Build the generic app without `--yamaha-host`. `npm run build` stages the root `LICENSE` and `THIRD_PARTY_NOTICES.md` in `app/` automatically so Tizen packages include them alongside `fonts/*-OFL.txt`. Retain these notices in any distributed source or binary package; regenerate them when the root notices change.
- [ ] Sign locally with your own certificates. Never include certificates, private keys, signing passwords, signature intermediates or personalised packages in source or public build artifacts. Do not use a maintainer's signing identity for untrusted contributor builds.
- [ ] Update the version in both `package.json` and `app/config.xml` when cutting a versioned app release. Create a tag and release notes describing changes, known limitations, installation and license notices. Do not promise a support period you cannot maintain.
- [ ] Recheck upstream service terms, asset permissions and privacy disclosures when integrations change. Open source licensing does not grant subscriptions, access to music catalogs, logo rights or permissions to redistribute media.

## Ongoing maintenance

Review security reports privately, keep contributor guidance accurate, and triage issues with reproducible evidence. Keep CI action pins current. If dependencies are added, introduce a lockfile and dependency update/security checks appropriate to that ecosystem. There is currently no npm dependency tree to maintain.
