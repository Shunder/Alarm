export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.requestPermission();
}

export function getNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export function notify(title, body) {
  if (getNotificationPermission() === 'granted') {
    new Notification(title, { body });
  }
}
