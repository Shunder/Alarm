import test from 'node:test';
import assert from 'node:assert/strict';
import { computeNextAlarm, formatTime } from '../src/lib/time.js';

test('computeNextAlarm schedules tomorrow when time passed', () => {
  const now = new Date('2025-01-01T10:00:00');
  const next = computeNextAlarm(9, 30, now);
  assert.equal(new Date(next).getDate(), 2);
});

<<<<<<< HEAD
test('formatTime renders hh:mm:ss', () => {
  assert.equal(formatTime(3661000), '01:01:01');
=======
test('formatTime renders hh:mm:ss and milliseconds', () => {
  assert.equal(formatTime(3661000), '01:01:01');
  assert.equal(formatTime(3661450, { showMilliseconds: true }), '01:01:01.45');
  assert.equal(formatTime(61123, { showHours: false, showMilliseconds: true }), '01:01.12');
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
});
