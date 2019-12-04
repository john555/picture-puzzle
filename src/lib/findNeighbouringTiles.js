import { findTileInPosition } from './findTileInPosition';

export function findNeighbouringTiles(game, tile) {
  const topTile = findTileInPosition(game, tile.x, tile.y - 1);
  const rightTile = findTileInPosition(game, tile.x + 1, tile.y);
  const bottomTile = findTileInPosition(game, tile.x, tile.y + 1);
  const leftTile = findTileInPosition(game, tile.x - 1, tile.y);

  return [topTile, rightTile, bottomTile, leftTile].filter(tile => tile);
}
