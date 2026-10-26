# Frame Music

A Samsung TV app for choosing Yamaha MusicCast sources and browsing music, including Deezer. The Yamaha streams the audio using its existing accounts. The TV displays menus and sends commands on the home network.

Frame Music's original code, documentation and artwork are available under the [MIT License](LICENSE). Bundled fonts retain their SIL Open Font License. See [third-party notices and project relationships](THIRD_PARTY_NOTICES.md) for sources, credits and license boundaries.

This is an independent community project. It is not affiliated with or endorsed by Samsung, Yamaha, Deezer or the other services it can display. Those products and services retain their own terms and trademarks.

Contributions are welcome: read [CONTRIBUTING.md](CONTRIBUTING.md), the [code of conduct](CODE_OF_CONDUCT.md), and the [security policy](SECURITY.md). Maintainers can use the [open-source release checklist](OPEN_SOURCE_CHECKLIST.md).

## Open-source relationships

| Project | Relationship to Frame Music |
| --- | --- |
| [pyamaha](https://github.com/rsc-dev/pyamaha) | MusicCast protocol reference for our JavaScript implementation; not an installed Python dependency. |
| [LRCLIB](https://github.com/tranxuanthang/lrclib) | External lyrics API used by `app/metadata.js`; its server code is not bundled. |
| [Mosaicast coordinator](packages/musiccast/README.md), [Noble](https://github.com/paulmillr/noble-ciphers), [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) | Local phone/TV coordination, authenticated encryption and QR rendering; bundled under MIT. |
| [esbuild](https://github.com/evanw/esbuild), [TypeScript](https://github.com/microsoft/TypeScript) | Development build tools; not shipped as TV runtimes. |
| [Node.js](https://github.com/nodejs/node) | Build, test and local preview runtime; the TV runs the generated JavaScript without Node.js. |
| [Tizen](https://www.tizen.org/) | Target web application platform; Samsung TV APIs and tooling are used separately from this source. |
| [Google Fonts](https://github.com/google/fonts) and the font projects | Seven font families bundled locally under OFL-1.1, with their original notices. |
| [actions/checkout](https://github.com/actions/checkout), [actions/setup-node](https://github.com/actions/setup-node) | GitHub CI tooling; not part of the TV application. |

The TV bundles the Mosaicast coordinator, Noble cryptography and qrcode-generator. esbuild and TypeScript are development tools. The [full inventory](THIRD_PARTY_NOTICES.md) links each font's upstream project and local license, and distinguishes these open-source relationships from proprietary device APIs and media content.

## Connect iPhone + TV with QR

On the TV, open **Connection → Connect phone + TV**. On the iPhone running Mosaicast Dev build 12 or newer, open **Connect phone + TV** and scan the TV code. Enter the Yamaha address on the phone if requested. Keep both apps open until pairing finishes. The code expires after five minutes; choose **New QR code** to replace it. Address pairing remains available as a fallback and requires comparing the six-digit code on both screens.

The TV writes its pairing to Tizen Key Manager in an alternate slot and verifies it by reading it back before asking the phone to save. The phone also verifies its secure-store write. A failure stays visible and **Try again** repeats only pairing confirmation, never a Yamaha command. Existing TV records remain intact if the replacement cannot be written. After restarting both apps, the saved pair reconnects without another QR scan. New QR setup checks the Yamaha automatically and opens the connected screen. If the TV shows **REFRESH CONNECTION** after a restart, choose **Refresh** to check the Yamaha before enabling controls. Both devices must be on the same home network (TV Ethernet and phone Wi-Fi are supported); discovery searches the local /24. The phone must be open for phone coordination. The TV waits for the phone lease to expire and requires **Refresh** before standalone recovery after a disconnect.

Browser preview stores pairing only in memory. Durable TV storage requires the Tizen Key Manager API. Pairing QR codes and stored records are credentials: do not include them in screenshots, logs or issues. The new flow is covered by simulated tests; physical iPhone/Frame TV validation is still required.

### Українською

На TV відкрийте **Connection → Connect phone + TV**. У Mosaicast Dev на iPhone (збірка 12 або новіша) відкрийте **Телефон + TV** та скануйте код телевізора. За потреби введіть адресу Yamaha на телефоні. Залиште обидва застосунки відкритими до завершення збереження. QR діє п’ять хвилин; для заміни оберіть **Новий QR-код**. Підключення за адресою залишається доступним із порівнянням коду на двох екранах.

Пара зберігається в захищеній пам’яті телефона та Tizen Key Manager телевізора. Обидва записи перевіряються читанням. Помилка збереження залишається на екрані; повторне підтвердження не повторює команд Yamaha. Після перезапуску повторно сканувати QR не потрібно. Нове QR-підключення автоматично перевіряє Yamaha та відкриває під’єднаний екран. Якщо TV показує **REFRESH CONNECTION** після перезапуску, натисніть **Refresh**, щоб перевірити стан Yamaha й увімкнути керування. Обидва пристрої мають бути в одній мережі; телефон має залишатися відкритим для координації. У браузерному прев’ю пара зберігається лише до перезавантаження сторінки. На фізичних iPhone і TV цей сценарій ще потрібно перевірити.

## Try it on this Mac

Requires Node.js 22 or newer. Install the locked dependencies first.

```sh
npm ci
npm start
```

Open http://127.0.0.1:4173. A fresh install starts in Preview mode with example music. Select **Connection**, enter the Yamaha’s local IPv4 address, and select **Connect**. Connecting reads device information, playback state and the Deezer menu when available without changing input or playback. If Deezer is missing or its menu is unavailable, the app opens Sources instead. The last successfully connected address is saved in local storage and reconnected automatically when the app launches. If reconnection fails, Connection opens with that address ready to retry or edit; no power, input or playback commands are sent.

After updating the app, stop and restart `npm start`, then reload the browser so the local server accepts the latest commands. An empty Deezer menu in standby opens Sources; power on the Yamaha and select **Browse Deezer** to load its menu.

Use arrow keys and Enter, or click. Escape returns to the previous menu. Flow and playable tracks start audio on the Yamaha when selected. Search opens a text field. Play/pause, previous and next control the Yamaha’s current network/USB source; the bottom bar identifies that source. These controls are disabled for CD, tuner, external inputs and standby. On the TV, **Channel Up (CH ↑)** skips to the next song and **Channel Down (CH ↓)** returns to the previous song. The D-pad continues to browse menus. The remote’s media keys are also supported. A collection advertising both open and play actions opens on Enter and plays with the Play key.

Remote navigation follows areas: Up/Down in the sidebar, arrows within the content grid, and Left/Right across button bars. Left from the edge of content enters the sidebar; Right returns to the remembered content item. Down past the last content row reaches the player, and Up returns to the originating area. Back from Now Playing, Sources, or a nested menu restores your item, page, and scroll position when that content still exists. Held arrows are paced; held OK and Back do not cascade through screens. At the TV root, Back opens an exit confirmation with **Keep listening** selected. Exiting the app leaves Yamaha playback alone.

The bottom bar also has **− / +** volume buttons and **Mute / Unmute**. Each press changes the Yamaha volume by one device step. The display shows its native level and maximum (0–63 on this CD-NT670D), not a percentage. Controls follow the capabilities and limits reported by the device. Volume and mute status refresh every ten seconds and immediately after a change; mute reads the current state before toggling so it follows changes made in MusicCast.

While Frame Music is open, the Samsung remote's **Volume up**, **Volume down** and **Mute** buttons control the connected Yamaha, including while a search or connection dialog is open. A held mute button toggles once; volume repeats are accepted when the preceding action has finished, without queuing delayed changes. In demo mode these keys change only simulated sound settings. Unsupported remote-key registration leaves the onscreen controls available. The channel rocker also works across dialogs. Holding it skips once, and presses during a pending action are consumed without queuing skips. Channel skips use the same fresh source and power checks as the onscreen playback buttons. These mappings apply only to this app in the foreground; it does not replace volume controls in other apps, TV menus or Art Mode. See [Samsung's remote key API](https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html).

Select **Now playing** in the sidebar or toolbar for the current song, artist, album, playback position/duration, album cover and lyrics when found. Details and cover art preload when the current network/USB track changes, including changes made through MusicCast; the player checks every ten seconds and immediately after an app playback action. Covers come from the connected Yamaha’s album-art directory and also appear in the bottom bar. Missing metadata or an unavailable cover leaves a readable fallback. CD, tuner, external inputs and standby clear retained network-player details.

Select the **artist name** in Now Playing to search Yamaha’s Deezer catalogue and open the artist with a matching name, including albums and singles when Deezer provides them. This discovers the route from Yamaha’s current menu, so it works without earlier browsing in Frame Music. Unmatched names leave the search results available to choose from. The artist shortcut requires Deezer browsing and the existing Yamaha Deezer account.

**Current playlist** reads the receiver’s network/USB queue directly, independently of browse history after a cold start. It highlights the playing song and shows eight tracks per page; **Refresh playlist** rereads it after changes elsewhere. Queue viewing is read-only. It uses Yamaha’s undocumented `getPlayQueue` endpoint, also described in the [SmartHomeNG Yamaha plugin](https://github.com/smarthomeNG/plugins/blob/develop/yamahayxc/__init__.py), and some inputs or firmware may not expose it. Companion mode requires a phone build containing the matching shared-package changes. The new artist and queue paths have simulated-device coverage but still need checking on the physical Yamaha and TV.

A large **clock, weekday and full date** stay at the top while browsing or viewing Now Playing, across all themes. They use the TV’s local time and locale and refresh immediately when the app resumes.

Lyrics use [LRCLIB’s public API](https://lrclib.net/docs), without an account or API key. The artist, song, album and duration are sent to LRCLIB; artwork stays on the home network. Lyrics load independently with an eight-second timeout and a bounded in-memory cache of 20 recordings. Repeated player polls reuse results; failed requests retry after a minute, missing matches after ten minutes, and successful matches after a day. Artist, title, album and known duration must match before lyrics are shown. Instrumental, missing and offline states are displayed explicitly. Delayed results from an earlier song are ignored. Use the **↑ Lyrics / ↓ Lyrics** buttons to scroll with the TV remote. Demo mode uses original example lyrics and an illustrated cover without contacting a provider.

Choose **Theme** at the top of the screen to compare four styles from the supplied Frame Music Directions boards: **Warm Gallery** (warm paper, framed cards and an olive player), **Listening Room Noir** (dark room, serif type and a focused-item preview), **Record Store** (cobalt navigation, numbered sleeves and bold borders), and **Quiet Precision** (compact ruled lists and restrained blue accents). Three additional dark palettes preserve those layouts: **Gallery Night** (dark olive and soft peach), **Record Store After Hours** (ink blue, muted sleeves and amber), and **Midnight Precision** (deep navy and cool blue). The light styles now use muted paper and grey surfaces to reduce large bright areas on a TV. Themes cover Browse, Now Playing, Sources, dialogs, lyrics and the player. Fonts and their OFL licenses are bundled locally; theme changes make no device requests.

Appearance also offers **Clear**, **Glass** (the default), and **Solid** surfaces, saved independently of the theme. Clear reveals more of the artwork through borderless panels, with local dark shading and text shadows to keep titles visible. Glass places readable song titles on translucent dark cards over artist backgrounds and matching artwork, with a brighter border for remote focus. Static translucent layers work without blur support on the TV. **Help** in the main navigation contains Remote, Playback, Connection, and Artwork & lyrics topics; playback instructions and setup notes live there rather than on each music card.

Tap the remote circle directions for normal focus navigation. With a music card focused, hold **Left / Right** for at least 550 ms to open the previous / next page of eight items. Within an artist collection opened through an **Artists** list, hold **Up / Down** to open the previous / next artist, including from nested albums. These shortcuts also work from the Artists list relative to the focused artist. Keep holding to continue browsing, with at least 800 ms between completed moves. Release to stop; moves already in progress finish, and repeats never queue more requests. Holding stops at collection boundaries or menu errors and sends no playback, power, or input-switch command. Shared Yamaha menus are checked again before navigation and selection; a changed menu requires choosing again.

Use arrows and OK to preview a style; Back closes the chooser and restores your screen and focus. Your choice is saved locally. Existing Light/Dark preferences remain available as **Classic Light / Classic Dark**. With no saved choice, **Gallery Night** is the default. Saved theme choices are preserved. Noir, Record Store and After Hours use horizontal top navigation: Left/Right moves between destinations and Down enters content. Gallery, Precision and the classic styles use the sidebar navigation described above.

The [Claude Design handoff](CLAUDE-DESIGN-HANDOFF.md) records the design brief, screen and state requirements, and remote navigation contract. The four directions are now implemented from the supplied boards, using actual Yamaha menu capabilities rather than the boards’ illustrative collection metadata.

Use **Power on Yamaha** and **Standby Yamaha** to send explicit power commands. Standby is the device’s normal off state and stops listening. The buttons follow the advertised power capability and confirmed state; power changes do not select an input or request playback. Remote power on requires Network Standby already enabled through MusicCast or the Yamaha settings. The app does not change that setting. If the device stops responding in standby, it reports the connection failure; restore network access or use the Yamaha remote.

An original receiver illustration shows power state: full colour with a lit green indicator when on, dimmed with an outlined indicator in standby, and dimmed with a solid muted indicator when status is unavailable. The status remains available to screen readers and in the indicator’s tooltip, and follows the existing ten-second status refresh.

## Sources and connectivity

Select **Sources** to see every input advertised for the device’s main zone and its supported capabilities. **Refresh** reads them again. **Browse** reads a source’s music menu without switching input or starting playback. Selecting a playable item can start audio. **Switch input** changes the Yamaha input explicitly, checks that it is still supported, and waits for confirmation; it disables network/USB autoplay and sends no power or playback command.

The CD-NT670D advertised these 16 inputs during a read-only local probe:

| Inputs | Available in this version |
| --- | --- |
| Deezer, Napster, Juke, Qobuz, TIDAL | Browse the device’s menu; switch input |
| PC / NAS, Internet radio, USB | Browse the device’s menu; switch input |
| Spotify Connect, AirPlay | Switch input; send music from the service app or an AirPlay sender |
| Bluetooth, MusicCast Link | Switch input; pairing and room setup through MusicCast |
| CD, FM / DAB radio, Optical input, AUX | Switch input; use the Yamaha remote for source-specific controls |

In companion mode, Browse is available for Deezer, PC / NAS, Internet radio and USB when advertised as network-player inputs. Other advertised inputs remain selectable, and network-player inputs keep their playback controls.

Its capability overview includes Ethernet, Wi-Fi, Wireless Direct, Bluetooth input/output, AirPlay, network and automatic standby, power, sleep timer, volume/mute, recent listening, play queue, MusicCast playlists, FM/DAB, linking/audio quality and up to nine multiroom clients. These describe what the Yamaha reports supporting, not which connections are active. Network setup, Bluetooth pairing/output settings, CD transport, station tuning, sleep settings, queue management and multiroom group creation are not exposed in this version.

Advertised streaming services can remain in older firmware even when unavailable. Accounts, subscriptions and regional availability are managed through Yamaha and the providers. See [Yamaha’s CD-NT670D product information](https://uk.yamaha.com/en/audio/home-audio/products/hifi-components/cd-nt670d/). This app does not bypass subscriptions or configure accounts.

## What was verified

The device observations below predate this integration port. They do not establish phone + TV pairing, handoff or physical TV behavior. See the [integration validation checklist](docs/companion-validation.md) for the new work.

Local probing confirmed a CD-NT670D with API 2.08 and firmware 2.16. Its Deezer root menu exposes Flow, Charts, Recommendations, Mixes, Genres, My library and Search; Search advertises the search capability. Initial browsing checks used read requests while Bluetooth playback was active. Safari successfully connected the app to the Yamaha and displayed its live menu and playback information. Arrow-key navigation, returning to the home menu and submitting a search were checked in demo mode. Live volume changes (0 → 1 → 0) and mute/unmute were confirmed through the app; the original sound settings were restored. Sound commands wait briefly for the device to confirm its updated state.

The source inventory and connectivity features above were confirmed with read-only device requests. Live power-on and standby commands were confirmed through the Safari app on the physical CD-NT670D; waking it made all seven Deezer root entries available. It was returned to its original standby state, with input and volume unchanged and no playback command sent. Source switching, USB browsing, source labels and playback guards were checked with the demo and simulated device responses. Full search results, nested browsing, starting audio, switching physical inputs and running on the physical TV still need hardware validation.

The new Now Playing screen was checked in Safari against the physical Yamaha: it preloaded track, artist, album, playback time, album cover and matching LRCLIB lyrics. This check sent no power, input, playback or sound commands. Tests cover delayed lyrics during track changes/standby, cover revisions, missing metadata, provider failures, bounded caching, browser fetch compatibility and artwork proxy restrictions. Lyrics and direct cover loading on the physical TV still need validation.

## Install on the Frame

The `app/` directory is a Tizen web application, with its own `config.xml`. In standalone mode the installed TV app talks directly to the Yamaha; the Mac preview uses a local proxy because desktop browsers restrict cross-origin requests. Direct HTTP access must be checked on the TV firmware. The preview proxy is loopback-only and is not an iPhone server.

1. Install [Tizen Studio and Samsung’s TV extension](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html), including the Samsung Certificate Extension.
2. On the TV’s Apps screen, enter **12345** to open Developer Mode. Enable it, enter this Mac’s LAN IP, and restart the TV. Keep the Mac, TV and Yamaha on the same network. See [Samsung’s device setup guide](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html).
3. Run `npm run build`, then import `app/` as an existing Tizen web project. In Certificate Manager, create a Samsung TV certificate profile with your TV’s device identifier. Keep certificate files and signing passwords outside this repository.
4. Connect to the TV in Device Manager and grant permission to install applications. Select the certificate profile, then run the project as a Tizen Web Application. Samsung’s tooling builds and signs the `.wgt` package.
5. Open Frame Music on the TV and choose **Connection → Connect phone + TV** for QR pairing with Mosaicast Dev. For direct TV control, enter the Yamaha’s address under **Connection** instead. Later launches reconnect automatically to the saved device, including after the TV restarts and opens the app again. This does not configure the TV to launch the app automatically at power-on.

The build also copies `LICENSE`, `THIRD_PARTY_NOTICES.md` and the full runtime dependency notices under `app/licenses/` into the TV package. Keep those generated notices and the bundled font licenses in redistributed TV packages.

Samsung preserves local storage during app updates but clears it when the app is uninstalled; see [Samsung's data storage FAQ](https://developer.samsung.com/smarttv/develop/faq/data-and-file-handling.html). For a personalised TV package that can reconnect even after a full uninstall/reinstall, run `npm run build -- --yamaha-host 192.168.1.20` with your device's private IPv4 address before staging/signing the package. That preset is embedded only in the ignored generated bundle, not the source. A valid saved address takes priority over the preset. A regular `npm run build` removes the preset and produces the generic setup experience. A changed DHCP address still requires updating Connection or using a router DHCP reservation.

The Tizen tools are not installed in this workspace, so no signed package or physical TV installation is claimed. No rooting is required. Frame Art Mode image uploads are separate work. The phone integration requires the matching Mosaicast Dev app described above.

To rebuild a signed widget with the Tizen CLI and an existing Samsung security profile:

```sh
npm run build
mkdir -p .context/artifacts
tizen build-web --output "$PWD/.context/tizen-build" -- app
tizen package -t wgt --output "$PWD/.context/artifacts" -- "$PWD/.context/tizen-build"
```

If `tizen` is not on PATH, use its full path under your Tizen Studio installation. The package command uses the active security profile. The generated widget stays under `.context/artifacts/`; certificates, signatures and widgets are not committed.

## Development

`check` typechecks the shared TypeScript package, runs its tests and the TV tests, and builds the standalone Tizen bundle. `npm run test:tv` runs just the TV suite; `npm run test:shared` runs the imported protocol suite. The workspace has no React Native dependency. Shared protocol changes must stay compatible with the phone; see [provenance](docs/integration-provenance.md).

```sh
npm test
```

The tests cover private host validation, endpoint restrictions, paged indices, search request formatting, serial device requests, errors, preview server protection and parsing the bundled TV script. The UI tests also run the actual bundle without `Object.hasOwn` or `Element.replaceChildren`, check Back against changed shared menus, and check dialog focus and keyboard shortcuts. Source tests cover main-zone capabilities, browsing without writes, confirmed input/power changes, unavailable Deezer/player information and blocking network playback after an external source change. Metadata tests cover independent preloading, stale responses, text-only rendering, provider matching, cache expiry and safe, size-bounded artwork proxying. `npm start` builds the app automatically. The build combines the source modules into one classic script to avoid module-loading restrictions in packaged TV widgets. Requests are serialized because MusicCast menu requests can hold the device busy for up to 30 seconds. The app validates the current menu before acting because MusicCast phone apps share its navigation state.

Protocol reference: [pyamaha’s documented MusicCast API](https://github.com/rsc-dev/pyamaha). TV reference: [Samsung remote control](https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html) and [application configuration](https://developer.samsung.com/smarttv/develop/guides/fundamentals/configuring-tv-applications.html).

Artist and album pages now give the main content panel a dark artist atmosphere as soon as an artist entry opens. Muse uses an original orbital landscape; other artists use a consistent dark palette. Artist folders establish the browsing identity, and current Yamaha metadata can identify an album reopened without browsing history. Matching local album art becomes a subdued backdrop when available; unrelated playing artwork is never used. Returning to general menus restores the selected theme. No artist-photo service or additional external lookup is used.
