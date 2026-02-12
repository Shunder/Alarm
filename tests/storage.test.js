import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeState } from '../src/lib/storage.js';

<<<<<<< HEAD
test('normalizeState migrates legacy single entities to arrays', () => {
=======
test('normalizeState migrates legacy single entities to arrays and ms fields', () => {
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
  const old = {
    alarm: { hour: 6, minute: 45, enabled: true, snoozeMinutes: 4, nextAt: 123 },
    timer: { duration: 10, remaining: 5, running: true, endAt: 999 },
    stopwatch: { elapsed: 1000, running: false, laps: [] },
  };
  const n = normalizeState(old);
<<<<<<< HEAD
  assert.equal(Array.isArray(n.alarms), true);
=======
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
  assert.equal(n.alarms.length, 1);
  assert.equal(n.timers.length, 1);
  assert.equal(n.stopwatches.length, 1);
  assert.equal(n.alarms[0].hour, 6);
<<<<<<< HEAD
=======
  assert.equal(n.timers[0].durationMs, 10000);
  assert.equal(n.timers[0].remainingMs, 5000);
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
});
