import test from 'node:test';
import assert from 'node:assert/strict';
import { startTimer, pauseTimer, tickTimer } from '../src/lib/timerMachine.js';

test('timer machine start pause and finish', () => {
  let s = { duration: 5, remaining: 5, running: false, endAt: null };
  s = startTimer(s, 1000);
  assert.equal(s.running, true);
  s = tickTimer(s, 4500);
  assert.equal(s.remaining, 2);
  s = pauseTimer(s);
  assert.equal(s.running, false);
  s = startTimer(s, 5000);
  s = tickTimer(s, 8000);
  assert.equal(s.remaining, 0);
  assert.equal(s.running, false);
});
