# Security policy

## Supported code

Security fixes target the latest code on `master`. Older snapshots and releases have no separate maintenance commitment. This is an experimental community project; no response deadline is guaranteed.

## Reporting vulnerabilities

Do not publish exploit details, credentials or private device data in public issues or pull requests. Use [GitHub's private vulnerability report form](https://github.com/Desperado/frame-music/security/advisories/new) when enabled. If private reporting is unavailable, contact the maintainer privately at strazhnyk@gmail.com to arrange disclosure.

Include the affected revision, a description of the impact, and minimal reproduction steps using invented data. Send credential names and redacted evidence only. If a credential has been exposed, its owner should revoke or rotate it; deleting a file or making a repository private does not revoke a credential.

## Trust and privacy

- The Mac preview binds to `127.0.0.1` and validates request origins, private IPv4 hosts, allowed routes and parameters. Keep it on the local machine; it is not designed as a publicly accessible or shared server.
- Yamaha commands use local HTTP without transport encryption or app-level authentication. Use a trusted home network. Do not expose the TV, receiver or proxy to the internet through port forwarding.
- Connecting and browsing are designed to avoid power, input or playback changes. Explicit controls can change the physical device's state and sound level.
- The selected Yamaha address and theme are stored in browser/TV local storage. Optional personalised builds embed a private IPv4 preset in the ignored generated bundle. Do not publish personalised packages.
- Lyrics requests send artist, track, album and duration to `https://lrclib.net`; no account or API key is used. Album covers stay on the home network. Lyrics are cached in memory. Preview mode uses local examples. There is no analytics or advertising integration in this source.
- Tests use simulated devices and provider responses. Never put service credentials, account data, signing material, real lyrics or private device responses into fixtures or CI.

## Contributor safeguards

Keep secrets and signing material outside the repository. `.gitignore` helps prevent accidental additions, but does not protect files already tracked or remove history. Inspect changes before sharing them and scan history before making a private repository public. Preserve upstream timeouts, response-size limits, redirect restrictions, host validation and text-only rendering when changing network paths.
