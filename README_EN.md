# Alarm (English)

A lightweight, production-ready web app for **Clock / Alarm / Timer / Stopwatch**, with PWA support and multi-language UI (English/中文).

This project is open source under the MIT License. See the LICENSE file for details.

## Features
- Clock, Alarm, Timer, Stopwatch, Settings tabs.
- Multiple alarms with enable/disable, snooze, and status list view.
- Multiple timers with independent start/pause/resume/reset and status list view.
- Multiple stopwatches with independent lap recording and status list view.
- Theme system: light/dark + 6 color themes.
- Language switch: English / 中文.
- Local persistence via `localStorage`.
- PWA manifest + service worker.


## Architecture Refactor Notes (2026-04)
- Added a centralized `AlarmApp` controller (`src/main.js`) to unify state, rendering, event handling, and tick scheduling.
- Replaced per-render node listeners with **root-level event delegation** (click/change/input) to reduce rebinding overhead and improve runtime reliability.
- Introduced tab-aware render throttling for clock/timer/stopwatch to avoid unnecessary paints and improve responsiveness.
- Upgraded the UI with glassmorphism cards and sticky navigation while keeping GitHub Pages static-path compatibility (no hardcoded absolute paths).

> This change is an architecture-level refactor, so both Chinese and English READMEs were updated together.

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
- 请查看：[`README.md`](./README.md)
