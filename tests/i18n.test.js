import test from 'node:test';
import assert from 'node:assert/strict';
import { t } from '../src/lib/i18n.js';

test('i18n supports en and zh with fallback', () => {
  assert.equal(t('en', 'tabClock'), 'Clock');
  assert.equal(t('zh', 'tabClock'), '时钟');
  assert.equal(t('zh', 'unknownKey'), 'unknownKey');
});
