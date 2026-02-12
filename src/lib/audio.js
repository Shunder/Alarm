const ctx = new (window.AudioContext || window.webkitAudioContext)();
let unlocked = false;

function beep(duration = 0.4, volume = 0.7, frequency = 880) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);}

export async function unlockAudio() {
  if (ctx.state === 'suspended') await ctx.resume();
  beep(0.08, 0.15, 660);  unlocked = true;
}

export function canPlayAudio() {
  return unlocked && ctx.state === 'running';
}

export function playAlarm(volume = 0.7) {
  if (!canPlayAudio()) return false;
  beep(0.35, volume, 880);
  setTimeout(() => beep(0.35, volume, 784), 420);
  setTimeout(() => beep(0.45, volume, 988), 860);  return true;
}
