import { addStyle } from './addStyle';

export function createStage(game) {
  const { options } = game;
  const stageElem = document.createElement('div');

  addStyle(stageElem, {
    position: 'relative',
    width: `${options.tileSize * options.columns}px`,
    height: `${options.tileSize * options.rows}px`,
  });

  return stageElem;
}
