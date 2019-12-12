export function onSolve(callback) {
  this.stage.addEventListener('solve', event => {
    clearInterval(this.timer);
    callback.call(this, event);
    this.time = 0;
  });
}
