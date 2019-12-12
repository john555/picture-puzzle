export function getRandomTileFromCollection(tiles) {
  let randomIndex = Math.floor(Math.random() * tiles.length);

  if (randomIndex === tiles.length) {
    randomIndex -= 1;
  }
  return tiles[randomIndex];
}
