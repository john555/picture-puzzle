import { onTileClick } from './onTileClick';
import { onTransitionEnd } from './onTransitionEnd';

export function bindTileEvents(game, tile) {
  tile.tileElement.addEventListener('click', onTileClick.bind({ game, tile }));
  tile.tileElement.addEventListener('transitionend', onTransitionEnd(game));
}
