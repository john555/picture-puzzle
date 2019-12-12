import { addStyle } from './addStyle';
import { duration } from '../config/constants';

export function animateTiles(game) {
  const { tiles, options } = game;
  let times = 5;
  const scaleValues = [options.scale, 0.85];
  const rotatationValues = [0, -30];
  const axes = ['y', 'x'];
  const randomAxis = axes[Math.floor(Math.random() * 2)];

  const id = setInterval(() => {
    if (times === 0) {
      clearInterval(id);
    }

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const x = tile.x * options.tileSize;
      const y = tile.y * options.tileSize;
      const translate = `translate(${x}px, ${y}px) scale(${
        scaleValues[times % scaleValues.length]
      })`;
      const rotation = `rotate(${
        rotatationValues[(times * tile[randomAxis]) % rotatationValues.length]
      }deg)`;
      const transform = `${translate} ${rotation}`;

      addStyle(tile.tileElement, {
        transform,
      });
    }

    times--;
  }, duration);
}
