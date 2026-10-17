# Mosaicast coordinator snapshot

This MIT-licensed package is copied from the Mosaicast workspace at revision
`bb7372b71a69fb75df28b7bb76afa2d2e740f1b0`, package version 0.1.0.
Copyright 2026 Mosaicast contributors; see [LICENSE](LICENSE).
The `src/` and `tests/` snapshot is unchanged. No private Git history, device
records, vendor logos, mobile assets or credentials are included.

Frame Music builds this local npm workspace and bundles the TV entry points
with esbuild. It does not depend on a private package registry or checkout.
When syncing the protocol, update this revision and run the package tests plus
the TV integration tests, including storage failures and restart behavior.
The matching phone implementation is Mosaicast Dev build 12 or newer.
