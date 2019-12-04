import { addStyle } from './addStyle';

export function swapTiles(game, tile, tile2) {
  const { options } = game;
  // visual swapping (This must be done before logical swapping.)
  const tileTransform = `translate(${tile2.x * options.tileSize}px, ${tile2.y *
    options.tileSize}px) scale(${options.scale})`;
  const emptyTileTransform = `translate(${tile.x *
    options.tileSize}px, ${tile.y * options.tileSize}px) scale(${
    options.scale
  })`;

  addStyle(tile.tileElement, {
    transform: tileTransform,
  });

  addStyle(tile2.tileElement, {
    transform: emptyTileTransform,
  });

  // logical swapping
  const { x, y, order } = tile;

  tile.x = tile2.x;
  tile.y = tile2.y;
  tile.order = tile2.order;
  tile2.x = x;
  tile2.y = y;
  tile2.order = order;
}
