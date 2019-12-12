export function getMatchingAxis(tile1, tile2) {
  if (tile1.x === tile2.x) {
    return 'x';
  }

  if (tile1.y === tile2.y) {
    return 'y';
  }
}
