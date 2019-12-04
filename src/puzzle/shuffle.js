import { moveRandomTile } from '../lib/moveRandomTile';
export function shuffle() {
  const { options } = this;

  return new Promise(resolve => {
    let times = Math.floor(
      Math.abs(options.difficulty * options.rows * options.columns),
    );
    let excludedTile;

    const intervalId = setInterval(() => {
      if (times === 0) {
        clearInterval(intervalId);
        resolve();
      }
      excludedTile = moveRandomTile(this, excludedTile);
      times--;
    }, 5);
  });
}
