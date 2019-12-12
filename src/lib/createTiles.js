import { addStyle } from './addStyle';
import { bindTileEvents } from './bindTileEvents';
import { duration } from '../config/constants';

export function createTiles(game) {
  const { options, tiles } = game;
  let order = 0;

  for (let y = 0; y < options.rows; y++) {
    for (let x = 0; x < options.columns; x++) {
      const tileElement = document.createElement('div');
      const left = x * options.tileSize;
      const top = y * options.tileSize;
      const isEmpty = order === options.rows * options.columns - 1;

      let backgroundSize = '';
      let backgroundPosition = '';

      if (options.image.preserve === 'width') {
        backgroundSize = `${options.columns * options.tileSize}px auto`;
        backgroundPosition = `-${left}px -${top - options.image.offset}px`;
      }

      if (options.image.preserve === 'height') {
        backgroundSize = `auto ${options.rows * options.tileSize}px`;
        backgroundPosition = `-${left - options.image.offset}px -${top}px`;
      }

      addStyle(tileElement, {
        width: `${options.tileSize}px`,
        height: `${options.tileSize}px`,
        position: `absolute`,
        left: '0',
        top: '0',
        transform: `translate(${left}px, ${top}px) scale(${options.scale})`,
        transition: `transform ${duration}ms linear`,
        zIndex: 1,
      });

      if (!isEmpty) {
        addStyle(tileElement, {
          backgroundImage: `url(${options.image.url})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition,
          backgroundSize,
          zIndex: 2,
        });
      }

      const tile = {
        x,
        y,
        order,
        isEmpty,
        tileElement,
      };

      bindTileEvents(game, tile);
      tiles.push(tile);
      order++;
    }
  }
}
