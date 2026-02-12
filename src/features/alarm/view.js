import { computeNextAlarm, relativeAlarmLabelKey, pad } from '../../lib/time.js';

export function renderAlarm(state, t) {
  const list = state.alarms.map((alarm, idx) => {
    const nextAt = alarm.nextAt ?? computeNextAlarm(alarm.hour, alarm.minute);
    const relative = t(relativeAlarmLabelKey(nextAt));
    return `<li class="list-item">
      <div>
        <strong>${t('item')} ${idx + 1}</strong>
        <div class="muted">${t('next')}: ${relative} ${pad(new Date(nextAt).getHours())}:${pad(new Date(nextAt).getMinutes())}</div>
      </div>
      <div class="row">
        <input data-alarm-hour="${alarm.id}" type="number" min="0" max="23" value="${alarm.hour}" />
        <input data-alarm-minute="${alarm.id}" type="number" min="0" max="59" value="${alarm.minute}" />
        <label class="row"><input data-alarm-enabled="${alarm.id}" type="checkbox" ${alarm.enabled ? 'checked' : ''}/> ${t('enabled')}</label>
        <input data-alarm-snooze="${alarm.id}" type="number" min="1" max="30" value="${alarm.snoozeMinutes}" />
        <button class="btn" data-alarm-delete="${alarm.id}">${t('delete')}</button>
      </div>
    </li>`;
  }).join('');

  return `<section class="card">
    <h2>${t('tabAlarm')}</h2>
    <p class="muted">${t('keepOpenHint')}</p>
    <div class="row">
      <button class="btn primary" id="alarm-add">${t('addAlarm')}</button>
    </div>
    <h3>${t('alarmList')}</h3>
    <ul class="entity-list">${list}</ul>
  </section>`;
}
