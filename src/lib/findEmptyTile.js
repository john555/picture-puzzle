export function findEmptyTile(tiles) {
  return tiles.filter(tile => (tile && tile.isEmpty) === true)[0];
}
