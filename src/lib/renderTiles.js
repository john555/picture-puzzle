export function renderTiles(game) {
  const { tiles, stage } = game;
  // TODO: Do validation on stage

  if (tiles.length < 0) {
    return;
  }

  for (let i = 0; i < tiles.length; i++) {
    stage.appendChild(tiles[i].tileElement);
  }
}
