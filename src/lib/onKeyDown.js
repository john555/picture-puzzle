import { findEmptyTile } from './findEmptyTile';
import { findTileInPosition } from './findTileInPosition';
import { swapTiles } from './swapTiles';
import { keyDirections } from '../config/constants';

export function onKeyDown(game, event) {
  if (!game.isPlaying) {
    return;
  }

  const emptyTile = findEmptyTile(game.tiles);

  switch (keyDirections[event.keyCode]) {
    case 'top':
      const topTile = findTileInPosition(game, emptyTile.x, emptyTile.y - 1);

      if (!topTile) {
        return;
      }

      swapTiles(game, topTile, emptyTile);
      break;
    case 'right':
      const rightTile = findTileInPosition(game, emptyTile.x + 1, emptyTile.y);

      if (!rightTile) {
        return;
      }

      swapTiles(game, rightTile, emptyTile);
      break;
    case 'bottom':
      const bottomTile = findTileInPosition(game, emptyTile.x, emptyTile.y + 1);

      if (!bottomTile) {
        return;
      }

      swapTiles(game, bottomTile, emptyTile);
      break;
    case 'left':
      const leftTile = findTileInPosition(game, emptyTile.x - 1, emptyTile.y);

      if (!leftTile) {
        return;
      }

      swapTiles(game, leftTile, emptyTile);
      break;
  }
}
