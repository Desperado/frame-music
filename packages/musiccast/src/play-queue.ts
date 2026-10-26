import { record } from './parsers';
import type { PlayQueue } from './types';

export function validQueueIndex(index: unknown): index is number {
  return Number.isInteger(index) && Number(index) >= 0 && Number(index) <= 64999;
}

// Queue metadata only. Do not carry service IDs, URLs or account data to peers.
export function parsePlayQueue(value: unknown, start = 0): PlayQueue {
  const data = record(value);
  if (!validQueueIndex(start) || !Number.isInteger(data.max_line) || Number(data.max_line) < 0 || Number(data.max_line) > 65000 ||
      (!Array.isArray(data.track_info) && data.max_line !== 0) || (data.index !== undefined && data.index !== start)) throw new Error('Playlist unavailable.');
  const total = Number(data.max_line);
  const text = (value: unknown) => typeof value === 'string' ? value.slice(0, 512) : '';
  // Some receivers return the whole queue. Keep peer replies bounded to one
  // TV page, including when titles contain long Unicode strings.
  const tracks = (Array.isArray(data.track_info) ? data.track_info : []).slice(0, Math.min(8, Math.max(0, total - start))).map((value, offset) => {
    const item = record(value);
    return { index: start + offset, title: text(item.track) || text(item.text) || 'Untitled track', artist: text(item.artist), album: text(item.album) };
  });
  if (total > start && !tracks.length) throw new Error('Playlist unavailable.');
  return { start, total, playingIndex: validQueueIndex(data.playing_index) && data.playing_index < total ? data.playing_index : null, tracks };
}
