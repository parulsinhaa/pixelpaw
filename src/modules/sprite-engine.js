import { getSkin } from './customization.js';

const states = {
  idle: ['sit', 'sit', 'blink', 'sit', 'tail'],
  walk: ['step1', 'step2', 'step1', 'step3'],
  run: ['run1', 'run2', 'run3', 'run2'],
  sit: ['sit', 'blink'],
  sleep: ['sleep1', 'sleep2', 'sleep1', 'dream'],
  jump: ['jump1', 'jump2', 'jump3', 'sit'],
  stretch: ['stretch1', 'stretch2', 'stretch3', 'stretch2'],
  happy: ['happy1', 'happy2', 'jump2', 'happy2'],
  typing: ['type1', 'type2', 'type1', 'type3'],
  curious: ['curious1', 'curious2', 'blink', 'curious2'],
  hungry: ['hungry1', 'hungry2', 'sit']
};

export class SpritePet {
  constructor(root, options = {}) {
    this.root = root;
    this.skin = options.skin || 'orange';
    this.state = options.state || 'idle';
    this.frameIndex = 0;
    this.fps = options.fps || 10;
    this.eyeX = 0;
    this.eyeY = 0;
    this.accessory = options.accessory || 'scarf';
    this.render();
    this.interval = setInterval(() => this.next(), 1000 / this.fps);
  }

  setState(state) {
    if (!states[state]) return;
    this.state = state;
    this.frameIndex = 0;
    this.render();
  }

  setSkin(id) {
    this.skin = id;
    this.render();
  }

  setAccessory(id) {
    this.accessory = id;
    this.render();
  }

  lookAt(x, y) {
    const rect = this.root.getBoundingClientRect();
    this.eyeX = Math.max(-1, Math.min(1, (x - rect.left - rect.width / 2) / rect.width));
    this.eyeY = Math.max(-1, Math.min(1, (y - rect.top - rect.height / 2) / rect.height));
    this.root.style.setProperty('--eye-x', `${this.eyeX * 4}px`);
    this.root.style.setProperty('--eye-y', `${this.eyeY * 3}px`);
  }

  next() {
    this.frameIndex = (this.frameIndex + 1) % states[this.state].length;
    this.render();
  }

  render() {
    const frame = states[this.state][this.frameIndex];
    const skin = getSkin(this.skin);
    this.root.dataset.state = this.state;
    this.root.dataset.frame = frame;
    this.root.style.setProperty('--fur', skin.body);
    this.root.style.setProperty('--spot', skin.spots);
    this.root.style.setProperty('--face', skin.face);
    this.root.innerHTML = `
      <div class="cat-sprite ${frame}">
        <i class="acc acc-${this.accessory}"></i>
        <i class="ear left"></i><i class="ear right"></i>
        <i class="head"></i><i class="body"></i><i class="belly"></i>
        <i class="spot one"></i><i class="spot two"></i>
        <i class="eye left"></i><i class="eye right"></i>
        <i class="nose"></i><i class="whisker left"></i><i class="whisker right"></i>
        <i class="paw left"></i><i class="paw right"></i><i class="tail"></i>
      </div>`;
  }
}
