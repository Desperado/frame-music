# Open-source publication and release checklist

This checklist covers work outside the source tree as well as release preparation. A checked-in policy does not enable a GitHub setting.

## Initial publication

Published on 2026-10-17 in a separate public repository, [Desperado/frame-music](https://github.com/Desperado/frame-music), from a clean source snapshot. The original development repository remains private. Its history, branches, pull requests, issues, attachments, Actions logs and artifacts were not copied to the public repository.

- [x] Scan the exact source snapshot and its new Git history with a redacting secret scanner before publication. The reviewed 53-file snapshot and new history produced zero matches with Gitleaks 8.30.1. The inventory excludes signing material, personal/device dumps and fetched media. Scanning does not guarantee the absence of secrets; repeat it for future publications and arrange any required rotation with the credential owner.
- [x] The owner confirmed the right to license the project's original code and artwork under [MIT](LICENSE), and clarified that the only externally obtained artwork was the removed Yamaha logo. The bundled fonts retain separate OFL notices. See [provenance](PROVENANCE.md).
- [x] Replace the official Yamaha logo with original artwork. Exclude the private development history containing the logo from the clean publication. See [third-party notices](THIRD_PARTY_NOTICES.md).
- [x] Review source examples and artwork: app icon, demo cover, demo lyrics and orbital illustration are project material. Exclude fetched lyrics/covers, screenshots, personalised bundles and private device dumps.
- [x] The owner confirmed that the security/conduct contact in [SECURITY.md](SECURITY.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) is monitored.
- [x] Publish only the reviewed snapshot with the licensing, notices and community files on its default branch. The original repository's private visibility was verified after publication. npm publication remains disabled.

## GitHub settings

- [x] Enable Issues and private vulnerability reporting. Verified through GitHub's API; the security policy links to the new repository's reporting form. Access from a separate contributor account has not been tested; the monitored email remains a fallback.
- [x] Enable secret scanning, push protection and Dependabot alerts. Review alerts privately; do not expose secret values.
- [x] Enable GitHub Actions with read-only default token permissions and approval for all external fork contributors. Only `actions/checkout` and `actions/setup-node` are allowed, and full commit SHA pins are enforced. The workflow uses `pull_request` and no deployment secrets; Actions cannot approve pull requests.
- [x] Protect `master`: require pull requests, one approving review and the confirmed `Test and build (22)` / `Test and build (24)` checks; require branches to be current, linear history and resolved conversations; block force pushes and deletion. The repository administrator retains GitHub's protection bypass for solo maintenance.
- [x] Set the repository description and topics. GitHub detects MIT and recognizes the README, contribution and conduct files; all 36 local Markdown links resolve. Initial hosted CI passed on Node.js 22 and 24, including all 91 tests and the generic build.

## For every release

- [ ] Review the change and connected code for correctness, security, device side effects and unnecessary complexity. Run `npm ci` and `npm run check` from a clean checkout; require CI success.
- [ ] Test the changed UI with the TV remote or keyboard. Report tested hardware, firmware and browsers, and state any unverified physical-device behavior. CI does not validate signing or installation on a TV.
- [ ] Update [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for new dependencies, copied code, services and assets. Record exact versions or source revisions for new vendored material, check license compatibility and retain required full license texts.
- [ ] Build the generic app without `--yamaha-host`. `npm run build` stages the root `LICENSE` and `THIRD_PARTY_NOTICES.md` in `app/` automatically so Tizen packages include them alongside `fonts/*-OFL.txt` and `licenses/*-MIT.txt`. Retain these notices in any distributed source or binary package; regenerate them when the root notices change.
- [ ] Sign locally with your own certificates. Never include certificates, private keys, signing passwords, signature intermediates or personalised packages in source or public build artifacts. Do not use a maintainer's signing identity for untrusted contributor builds.
- [ ] Update the version in both `package.json` and `app/config.xml` when cutting a versioned app release. Create a tag and release notes describing changes, known limitations, installation and license notices. Do not promise a support period you cannot maintain.
- [ ] Recheck upstream service terms, asset permissions and privacy disclosures when integrations change. Open source licensing does not grant subscriptions, access to music catalogs, logo rights or permissions to redistribute media.

## Ongoing maintenance

Review security reports privately, keep contributor guidance accurate, and triage issues with reproducible evidence. Keep CI action pins current. Keep the pinned npm lockfile, Dependabot updates and dependency security checks current.
