export function isSolved() {
  const { tiles } = this;

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];

    if (tile.order !== i) {
      return false;
    }
  }

  return true;
}
