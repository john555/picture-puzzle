import { updateTime } from '../lib/updateTime';

export function start() {
  if (this.isPlaying) {
    return new Promise(resolve => {
      resolve();
    });
  }

  return this.shuffle().then(() => {
    this.isPlaying = true;
    updateTime(this);
    this.timer = setInterval(() => {
      updateTime(this);
    }, 1000);

    this.stage.dispatchEvent(new Event('start'));
  });
}
