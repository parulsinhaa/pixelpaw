export class PixelNotifications {
  constructor(surface) {
    this.surface = surface;
  }

  say(message, mood = 'happy') {
    const note = document.createElement('div');
    note.className = 'toast pixel-border';
    note.textContent = message;
    this.surface.appendChild(note);
    window.pixelpaw?.sendMood?.(mood);
    setTimeout(() => note.remove(), 3600);
  }

  async system(message) {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('PixelPaw', { body: message });
    }
    this.say(message);
  }
}
