# NAS media: strictly read-only

- Never create, modify, overwrite, rename, move, or delete any file or directory
  on the NAS, including mounted shares such as `/Volumes/media`.
- Never change NAS permissions, ownership, timestamps, extended attributes,
  metadata, artwork, subtitles, sidecar files, or directory structure.
- Reading, listing, searching, and streaming existing media are allowed.
- Store application databases, caches, logs, generated artwork, subtitles,
  transcodes, and other generated files on the laptop, outside NAS shares.
- Run the local Jellyfin prototype with the read-only sandbox provided by
  `.context/start-jellyfin-readonly.sh`. Do not bypass that sandbox.
- Never test write protection by attempting a write on the NAS. Use a
  disposable local directory for any write-denial test.
- These restrictions are mandatory. Do not make an exception without an
  explicit new instruction from the user changing this rule.
