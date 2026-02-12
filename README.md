# Alarm (English)

A lightweight, production-ready web app for **Clock / Alarm / Timer / Stopwatch**, with PWA support and multi-language UI (English/中文).

## Features
- Clock, Alarm, Timer, Stopwatch, Settings tabs.
- Multiple alarms with enable/disable, snooze, and status list view.
- Multiple timers with independent start/pause/resume/reset and status list view.
- Multiple stopwatches with independent lap recording and status list view.
- Theme system: light/dark + 6 color themes.
- Language switch: English / 中文.
- Local persistence via `localStorage`.
- PWA manifest + service worker.

## Run
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Browser limitations
- Browsers can throttle background tabs, so alarm/timer precision may degrade when hidden/locked.
- Audio requires explicit user interaction (tap **Test Sound**) due to autoplay policies.
- Notification fallback is used when permitted.

## GitHub Pages
- Workflow: `.github/workflows/deploy-pages.yml`
- Trigger: push to `main` or manual dispatch.
- Enable Pages source as **GitHub Actions** in repository settings.

## Chinese README
- 请查看：[`README.zh.md`](./README.zh.md)
