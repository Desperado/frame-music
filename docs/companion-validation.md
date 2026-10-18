# Integration validation

The port includes automated shared-protocol and TV tests. These use simulated
Yamaha responses and synthetic pairing records; they establish no physical
pairing, radio, Bluetooth or handoff result. Historical Yamaha observations in
the root README apply only to the earlier standalone app.

## Automated checks

This public port is checked with `npm ci` and `npm run check`: shared-protocol
and TV regression tests, TypeScript checks and the classic-script build.
No signed widget, TV installation or physical pairing was tested for this port.

Run `npm ci` then `npm run check`. Coverage includes:

- QR pairing/restart, alternate-slot saving and readback failure, lost save
  acknowledgement and explicit retry; two-sided comparison approval, commitment tampering,
  authenticated encryption, direction/session/counter checks and replay rejection.
- Phone authority expiry, fencing immediately before device writes, slow-menu
  heartbeats, lost handoff/action replies, delayed TV takeover and explicit Refresh.
- A lost cached status reply preserves the shared session; a stalled observation
  recovers within the authority lease. Lost command replies still never replay.
- Acknowledged volume changes retry failed confirmation reads within the existing
  four-read limit; complete confirmation failure still requires Refresh.
- Shared Refresh clears the TV recovery warning without hiding other errors.
- Shared menu ownership, stale selection rejection, busy dropping and no replay.
- Capability-driven Bluetooth/FM/DAB protocol and TV radio controls.
- The actual TV bundle, semantic adapter, setup discovery/cancellation, preserved
  presentation/navigation and backgrounding during dialogs or a pending connection.
- Demo isolation, private hosts, preview proxy restrictions and packaged CSP.

## Physical acceptance still required

Use a fresh native Mosaicast iPhone build containing `MosaicastPeer` and SecureStore,
a signed Tizen app built from this repository, and the actual Yamaha on the same LAN.
Keep listening volume low for deliberate playback checks. Record model/firmware,
app builds and observed outcomes without recording pairing keys or envelopes.

- Pair by scanning the TV QR with Mosaicast Dev 12+. Restart both apps and
  verify reconnection without scanning. Test expired QR and storage/readback failure.
  Confirm the old TV record survives a failed replacement, and no Yamaha command
  repeats when retrying a lost save acknowledgement. Also test address pairing
  with matching codes approved on both screens and reject a mismatch.
- Discover the phone automatically; test manual address entry and a phone DHCP
  address change. Check local-network permissions and router isolation failures.
- With both apps visible, confirm shared observations and a single explicit
  volume/input/playback action; observations must cause no echo writes.
- Test slow menus, simultaneous controls, explicit menu takeover and external
  MusicCast navigation. Busy presses must not execute later; stale selections must fail.
- Close/background the phone. Confirm TV writes remain blocked for 60 seconds
  after detecting loss, then work only after successful explicit Refresh.
- Reopen the phone during a TV operation. Confirm the TV drains it, yields, then
  requires Refresh. Test a lost handoff reply and a dropped action reply: neither
  action may replay, and passive polling must not unlock an uncertain result.
- Close the TV. Use the phone's explicit closed-TV takeover, then Refresh. Do not
  use that takeover while the TV remains open across a network partition.
- Background the TV during connection and while a dialog/slow menu is pending.
  It must stop discovery/authority renewal, and no delayed Yamaha write may start.
- Verify advertised FM/DAB controls and the phone's Bluetooth output on real
  hardware. The TV has no headphone-management screen; speaker volume is separate
  from a headphone's own volume.
- Verify artwork/lyrics, theme contrast, D-pad focus, long holds, channel/media
  and volume keys on the Frame remote. Demo must make no real receiver requests.

Passing JavaScript tests or preview smoke checks cannot close this checklist.
