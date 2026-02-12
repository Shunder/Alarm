const messages = {
  en: {
    tabClock: 'Clock', tabAlarm: 'Alarm', tabTimer: 'Timer', tabStopwatch: 'Stopwatch', tabSettings: 'Settings',
    showSeconds: 'Show seconds', keepOpenHint: 'Keep this tab open for accurate alarms in browsers.',
    enabled: 'Enabled', next: 'Next', today: 'Today', tomorrow: 'Tomorrow', snoozeMinutes: 'Snooze minutes',
    save: 'Save', timerSet: 'Timer set.', alarmSaved: 'Alarm time saved.',
    timer: 'Timer', start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Reset',
    stopwatch: 'Stopwatch', lap: 'Lap', settings: 'Settings', theme: 'Theme',
    switchToLight: 'Switch to Light', switchToDark: 'Switch to Dark',
    soundAndNotification: 'Sound & Notifications', volume: 'Volume', testSound: 'Test Sound',
    requestNotification: 'Request Notification', notification: 'Notification', language: 'Language',
    ringTimeUp: 'Time is up.', stop: 'Stop', snooze: 'Snooze', alarmNotice: 'Alarm notice',
    soundBlockedNotice: 'ended but sound was blocked. Open app and tap Test Sound.', soundTestPlayed: 'Sound test played.',
    alarmList: 'Alarm list', timerList: 'Timer list', stopwatchList: 'Stopwatch list',
    addAlarm: 'Add alarm', addTimer: 'Add timer', addStopwatch: 'Add stopwatch', delete: 'Delete',
<<<<<<< HEAD
    running: 'Running', paused: 'Paused', idle: 'Idle', done: 'Done',
    item: 'Item',
=======
    running: 'Running', paused: 'Paused', idle: 'Idle', done: 'Done', item: 'Item',
    cannotDeleteLast: 'At least one item must remain.', displayPrecision: 'Display precision',
    timerMilliseconds: 'Show milliseconds for timers', stopwatchMilliseconds: 'Show milliseconds for stopwatches',
    theme_blue: 'Blue', theme_purple: 'Purple', theme_green: 'Green', theme_orange: 'Orange', theme_red: 'Red', theme_cyan: 'Cyan',
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
  },
  zh: {
    tabClock: '时钟', tabAlarm: '闹钟', tabTimer: '倒计时', tabStopwatch: '计时器', tabSettings: '设置',
    showSeconds: '显示秒', keepOpenHint: '请保持此标签页打开，以提高浏览器内闹钟准时性。',
    enabled: '启用', next: '下次', today: '今天', tomorrow: '明天', snoozeMinutes: '稍后提醒（分钟）',
    save: '保存', timerSet: '倒计时已设置。', alarmSaved: '闹钟时间已保存。',
    timer: '倒计时', start: '开始', pause: '暂停', resume: '继续', reset: '重置',
    stopwatch: '计时器', lap: '分段', settings: '设置', theme: '主题',
    switchToLight: '切换浅色', switchToDark: '切换深色',
    soundAndNotification: '声音与通知', volume: '音量', testSound: '测试声音',
    requestNotification: '请求通知权限', notification: '通知', language: '语言',
    ringTimeUp: '时间到。', stop: '停止', snooze: '稍后提醒', alarmNotice: '闹钟提醒',
    soundBlockedNotice: '已结束但声音被浏览器拦截，请打开应用并点击“测试声音”。', soundTestPlayed: '已播放测试声音。',
    alarmList: '闹钟列表', timerList: '倒计时列表', stopwatchList: '计时器列表',
    addAlarm: '新增闹钟', addTimer: '新增倒计时', addStopwatch: '新增计时器', delete: '删除',
<<<<<<< HEAD
    running: '运行中', paused: '已暂停', idle: '未开始', done: '已完成',
    item: '项目',
=======
    running: '运行中', paused: '已暂停', idle: '未开始', done: '已完成', item: '项目',
    cannotDeleteLast: '至少保留一个项目。', displayPrecision: '显示精度',
    timerMilliseconds: '倒计时显示毫秒', stopwatchMilliseconds: '计时器显示毫秒',
    theme_blue: '蓝色', theme_purple: '紫色', theme_green: '绿色', theme_orange: '橙色', theme_red: '红色', theme_cyan: '青色',
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
  },
};

export const languages = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
];

export function t(lang, key) {
  return messages[lang]?.[key] ?? messages.en[key] ?? key;
}
