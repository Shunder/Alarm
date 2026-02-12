import test from 'node:test';
import assert from 'node:assert/strict';
import { computeNextAlarm, formatTime } from '../src/lib/time.js';

test('computeNextAlarm schedules tomorrow when time passed', () => {
  const now = new Date('2025-01-01T10:00:00');
  const next = computeNextAlarm(9, 30, now);
  assert.equal(new Date(next).getDate(), 2);
});

test('formatTime renders hh:mm:ss', () => {
  assert.equal(formatTime(3661000), '01:01:01');});
