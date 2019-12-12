import { findEmptyTile } from './findEmptyTile';
import { findNeighbouringTiles } from './findNeighbouringTiles';
import { getRandomTileFromCollection } from './getRandomTileFromCollection';
import { swapTiles } from './swapTiles';

export function moveRandomTile(game, excludedTile) {
  const emptyTile = findEmptyTile(game.tiles);
  let tileCollection = findNeighbouringTiles(game, emptyTile);

  // remove excluded tile from collection
  tileCollection = tileCollection.filter(tile => tile !== excludedTile);

  const targetTile = getRandomTileFromCollection(tileCollection);
  swapTiles(game, targetTile, emptyTile);
  return targetTile;
}
