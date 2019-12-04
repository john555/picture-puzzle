import { defaultOptions } from '../config/options';
import { preserveWhiteList } from '../config/constants';
import { createStage } from '../lib/createStage';
import { createTiles } from '../lib/createTiles';
import { renderTiles } from '../lib/renderTiles';
import { bindEvents } from '../lib/bindEvents';

export function init(game, userOptions) {
  if (!userOptions.image.url) {
    throw new Error('You MUST specify the image to use.');
  }

  game.tiles = [];
  game.isPlaying = false;
  game.time = 0;

  if (
    userOptions.image.preserve &&
    preserveWhiteList.indexOf(userOptions.image.preserve) < 0
  ) {
    throw new Error(
      `Invalid value '${userOptions.image.preserve}' for the option image.preserve`,
    );
  }

  const imageOptions = Object.assign(
    {},
    defaultOptions.image,
    userOptions.image,
  );

  // Override default options with user options
  game.options = Object.assign({}, defaultOptions, userOptions);
  game.options.image = imageOptions;

  game.stage = createStage(game);

  createTiles(game);
  renderTiles(game);
  bindEvents(game);
  // shuffleTiles(game);
  return game.stage;
}
