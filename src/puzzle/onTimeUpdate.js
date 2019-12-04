export function onTimeUpdate(callback) {
  this.stage.addEventListener('timeupdate', callback);
}
