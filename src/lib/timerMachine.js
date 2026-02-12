export function startTimer(state, now) {
  return { ...state, running: true, endAt: now + state.remaining * 1000 };
}

export function pauseTimer(state) {
  return { ...state, running: false, endAt: null };
}

export function tickTimer(state, now) {
  if (!state.running || !state.endAt) return state;
  const remaining = Math.max(0, Math.ceil((state.endAt - now) / 1000));
  return { ...state, remaining, running: remaining > 0, endAt: remaining > 0 ? state.endAt : null };
}
