const ctx = new (window.AudioContext || window.webkitAudioContext)();
let unlocked = false;

<<<<<<< HEAD
function beep(duration = 0.4, volume = 0.7, frequency = 880) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
=======
function tone({ time, duration, volume, frequency }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(volume, time + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(time);
  osc.stop(time + duration + 0.02);
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
}

export async function unlockAudio() {
  if (ctx.state === 'suspended') await ctx.resume();
<<<<<<< HEAD
  beep(0.08, 0.15, 660);
=======
  tone({ time: ctx.currentTime, duration: 0.12, volume: 0.04, frequency: 520 });
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
  unlocked = true;
}

export function canPlayAudio() {
  return unlocked && ctx.state === 'running';
}

export function playAlarm(volume = 0.7) {
  if (!canPlayAudio()) return false;
<<<<<<< HEAD
  beep(0.35, volume, 880);
  setTimeout(() => beep(0.35, volume, 784), 420);
  setTimeout(() => beep(0.45, volume, 988), 860);
=======
  const base = ctx.currentTime;
  const v = Math.min(0.22, Math.max(0.02, volume * 0.2));
  [
    { offset: 0, f: 523.25 },
    { offset: 0.26, f: 659.25 },
    { offset: 0.52, f: 783.99 },
  ].forEach((note) => tone({ time: base + note.offset, duration: 0.22, volume: v, frequency: note.f }));
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
  return true;
}
