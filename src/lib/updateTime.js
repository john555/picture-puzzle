export function updateTime(game) {
  const timeUpdateEvent = new Event('timeupdate');
  timeUpdateEvent.time = game.time++;
  game.stage.dispatchEvent(timeUpdateEvent);
}
