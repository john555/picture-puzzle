import { swapTiles } from './swapTiles';

export function moveManyTiles(game, tiles, varyingAxis) {
  // When first tile is empty
  const firstTile = tiles[0];

  if (!firstTile) {
    return;
  }

  if (firstTile.isEmpty) {
    // move first tile to the end
    for (let i = 1; i < tiles.length; i++) {
      swapTiles(game, firstTile, tiles[i]);
    }
    return;
  }

  const lastTile = tiles[tiles.length - 1];

  if (!lastTile) {
    return;
  }

  for (let i = tiles.length - 1; i >= 0; i--) {
    swapTiles(game, lastTile, tiles[i]);
  }
}
