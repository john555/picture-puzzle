import { inverseAxes } from '../config/constants';

export function getTilesInRange(game, emptyTile, startTile, endTile, axis) {
  const { tiles } = game;

  const iAxis = inverseAxes[axis];

  const range = tiles.filter(tile => {
    const isInRange =
      tile[iAxis] >= startTile[iAxis] && tile[iAxis] <= endTile[iAxis];
    return isInRange && tile[axis] === emptyTile[axis];
  });

  return range.sort((a, b) =>
    a[iAxis] > b[iAxis] ? -1 : a[iAxis] < b[iAxis] ? 1 : 0,
  );
}
