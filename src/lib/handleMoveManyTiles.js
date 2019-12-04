import { getTilesInRange } from './getTilesInRange';
import { moveManyTiles } from './moveManyTiles';
import { getMatchingAxis } from './getMatchingAxis';
import { findEmptyTile } from './findEmptyTile';
import { inverseAxes } from '../config/constants';

export function handleMoveManyTiles(game, lastTile) {
  const { tiles } = game;
  const emptyTile = findEmptyTile(tiles);
  const axis = getMatchingAxis(emptyTile, lastTile);

  if (!axis) {
    return;
  }

  const iAxis = inverseAxes[axis];
  const startTile = lastTile[iAxis] < emptyTile[iAxis] ? lastTile : emptyTile;
  const endTile = lastTile[iAxis] < emptyTile[iAxis] ? emptyTile : lastTile;

  const movingTiles = getTilesInRange(
    game,
    emptyTile,
    startTile,
    endTile,
    axis,
  );

  moveManyTiles(game, movingTiles, iAxis);
}
