import { animateTiles } from './animateTiles';

export function onTransitionEnd(game) {
  return function() {
    if (game.isPlaying && game.isSolved()) {
      clearInterval(game.timer);
      const solveEvent = new Event('solve');

      // Subtract 1 in order to match this time
      // with the value sent via the timeupdate event
      solveEvent.time = game.time - 1;
      game.stage.dispatchEvent(solveEvent);
      game.isPlaying = false;
      animateTiles(game);
    }
  };
}
