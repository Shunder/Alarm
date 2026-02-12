const palette = {
  blue: '#4f7cff',
  purple: '#8b5cf6',
  green: '#16a34a',
  orange: '#ea580c',
  red: '#dc2626',
  cyan: '#0891b2',
};

export function applyTheme(mode, theme) {
  const root = document.documentElement;
  root.dataset.mode = mode;
  root.dataset.theme = theme;
  const color = palette[theme] ?? palette.blue;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
}

export const themes = Object.keys(palette);
