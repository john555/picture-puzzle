export function findTileInPosition(game, px, py) {
  const { tiles } = game;
  const matches = tiles.filter(tile => {
    return tile.x === px && tile.y === py;
  });
  return matches[0];
}
