// Example menus/track titles only. This transport never contacts a device.
export function demoTransport() {
  let layer = 0, menu = 'Deezer', playback = 'pause', track = 'A slower kind of Sunday', volume = 12, mute = false, power = 'on', input = 'deezer', browsingInput = 'deezer';
  const inputs = ['napster', 'spotify', 'juke', 'qobuz', 'tidal', 'deezer', 'airplay', 'mc_link', 'server', 'net_radio', 'bluetooth', 'usb', 'tuner', 'cd', 'digital', 'aux'];
  const deezerRoot = ['Flow', 'Charts', 'Recommendations', 'Mixes', 'Genres', 'My library', 'Search'];
  const root = () => browsingInput === 'deezer' ? deezerRoot : ['Example collection', 'Example track'];
  const songs = ['A slower kind of Sunday', 'Light through the window', 'Somewhere in the garden', 'After the rain'];
  let searchArtist = '', artistMenu = false;
  const parents = [];
  const menuItems = () => !layer ? root().map((text, i) => ({ text, attribute: browsingInput === 'deezer' ? (i === 0 ? 4 : i === 6 ? 10 : 2) : i === 0 ? 2 : 4 })) :
    searchArtist && menu === 'Artists' ? [{ text: searchArtist, attribute: 2 }] :
    artistMenu && menu === searchArtist ? ['Albums', 'Singles & EPs', 'Top tracks'].map(text => ({ text, attribute: 2 })) :
    artistMenu && ['Albums', 'Singles & EPs'].includes(menu) ? [{ text: menu === 'Albums' ? 'Example music' : 'After the rain · Single', attribute: 2 }] :
    songs.map(text => ({ text, attribute: 4 }));
  return async (_host, route, params) => {
    if (route === 'system/getDeviceInfo') return { response_code: 0, model_name: 'Demo Yamaha' };
    if (route === 'system/getFeatures') return { response_code: 0, system: { func_list: ['wired_lan', 'wireless_lan', 'wireless_direct', 'network_standby', 'auto_power_standby', 'bluetooth_tx_setting', 'airplay'], input_list: inputs.map(id => ({id, play_info_type: id === 'tuner' ? 'tuner' : id === 'cd' ? 'cd' : ['digital', 'aux'].includes(id) ? 'none' : 'netusb'})) }, zone: [{ id: 'main', func_list: ['power', 'sleep', 'prepare_input_change', 'volume', 'mute', 'link_control', 'link_audio_quality'], input_list: inputs, range_step: [{ id: 'volume', min: 0, max: 63, step: 1 }] }], netusb: {func_list: ['recent_info', 'play_queue', 'mc_playlist']}, tuner: {func_list: ['fm', 'dab']}, distribution: {version: 2, client_max: 9} };
    if (route === 'main/getStatus') return { response_code: 0, power, input, volume, max_volume: 63, mute };
    if (route === 'main/setPower') { power = params.power; if (power === 'standby') playback = 'stop'; }
    if (route === 'main/setInput') input = params.input;
    if (route === 'main/setVolume') volume = Math.max(0, Math.min(63, volume + (params.volume === 'up' ? 1 : -1)));
    if (route === 'main/setMute') mute = params.enable;
    if (route === 'netusb/getPlayInfo') return { response_code: 0, input, playback, track, artist: 'The Quiet Hours', album: 'Example music' };
    if (route === 'netusb/getPlayQueue') return { response_code: 0, index: params.index, max_line: songs.length, playing_index: Math.max(0, songs.indexOf(track)), track_info: songs.slice(params.index).map(track => ({ track, artist: 'The Quiet Hours', album: 'Example music' })) };
    if (route === 'netusb/getListInfo') {
      if (browsingInput !== params.input) { browsingInput = params.input; layer = 0; parents.length = 0; searchArtist = ''; artistMenu = false; }
      const items = menuItems();
      return { response_code: 0, input: params.input, menu_layer: layer, index: params.index, max_line: items.length, menu_name: layer ? menu : params.input === 'deezer' ? 'Deezer' : params.input.replaceAll('_', ' '), list_info: items.slice(params.index, params.index + 8) };
    }
    if (route === 'netusb/setListControl') {
      if (params.type === 'return') { const parent = parents.pop(); if (parent) ({layer, menu, searchArtist, artistMenu} = parent); else { layer = 0; menu = 'Deezer'; searchArtist = ''; artistMenu = false; } }
      else if (params.type === 'select') { const item = menuItems()[params.index]; parents.push({layer, menu, searchArtist, artistMenu}); layer++; menu = item.text; if (searchArtist && menu === searchArtist) artistMenu = true; }
      else { input = browsingInput; playback = 'play'; track = layer ? songs[params.index] : songs[0]; }
    }
    if (route === 'netusb/setSearchString') { parents.push({layer, menu, searchArtist, artistMenu}); layer++; menu = 'Artists'; searchArtist = params.string; }
    if (route === 'netusb/setPlayback') playback = params.playback === 'play_pause' ? (playback === 'play' ? 'pause' : 'play') : params.playback === 'pause' || params.playback === 'stop' ? params.playback : 'play';
    return { response_code: 0 };
  };
}
