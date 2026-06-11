export class Pomodoro {
  constructor({ onTick, onState }) {
    this.focusMinutes = 25;
    this.breakMinutes = 5;
    this.remaining = this.focusMinutes * 60;
    this.mode = 'focus';
    this.timer = null;
    this.onTick = onTick;
    this.onState = onState;
  }

  start(minutes = this.focusMinutes) {
    this.mode = 'focus';
    this.remaining = minutes * 60;
    this.stop();
    this.onState?.('focus');
    this.timer = setInterval(() => this.tick(), 1000);
    this.onTick?.(this.remaining, this.mode);
  }

  break() {
    this.mode = 'break';
    this.remaining = this.breakMinutes * 60;
    this.onState?.('break');
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  tick() {
    this.remaining -= 1;
    if (this.remaining <= 0) {
      if (this.mode === 'focus') {
        this.break();
      } else {
        this.stop();
        this.mode = 'done';
        this.onState?.('done');
      }
    }
    this.onTick?.(this.remaining, this.mode);
  }

  label() {
    const minutes = Math.floor(this.remaining / 60).toString().padStart(2, '0');
    const seconds = (this.remaining % 60).toString().padStart(2, '0');
    return `${this.mode} ${minutes}:${seconds}`;
  }
}
