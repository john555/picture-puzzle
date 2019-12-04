import { handleMoveManyTiles } from './handleMoveManyTiles';

export function onTileClick() {
  if (!this.game.isPlaying) {
    return;
  }

  const { game, tile } = this;
  handleMoveManyTiles(game, tile);
}
