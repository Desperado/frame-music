import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('capability chips keep readable contrast on Warm Gallery in Clear, Glass and Solid', async () => {
  const themes = await readFile(new URL('../app/themes.css', import.meta.url), 'utf8');
  const styles = await readFile(new URL('../app/styles.css', import.meta.url), 'utf8');
  const variables = block => Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*([^;}]+)/g)].map(([, key, value]) => [key, value.trim()]));
  const warm = variables(themes.match(/:root\[data-theme=warm-gallery\]\{([^}]+)\}/)[1]);
  const translucent = variables(themes.match(/html:not\(\[data-surface=solid\]\) #main-content\{([^}]+)\}/)[1]);
  // The chips inherit the content ink and use the local surface as their opaque background.
  assert.match(styles, /\.capability-list li\{[^}]*background:var\(--surface\)/);
  const luminance = color => {
    assert.match(color, /^#[\da-f]{6}$/i);
    const channels = color.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  for (const mode of ['clear', 'glass', 'solid']) {
    const colors = mode === 'solid' ? warm : { ...warm, ...translucent };
    const values = [luminance(colors['--ink']), luminance(colors['--surface'])].sort((a, b) => b - a);
    const contrast = (values[0] + 0.05) / (values[1] + 0.05);
    assert.ok(contrast >= 4.5, `${mode} capability text needs 4.5:1 contrast; got ${contrast.toFixed(2)}:1`);
  }
});
