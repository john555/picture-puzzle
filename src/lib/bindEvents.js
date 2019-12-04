import { onKeyDown } from './onKeyDown';

export function bindEvents(game) {
  if (
    global.addEventListener &&
    typeof global.addEventListener === 'function'
  ) {
    global.addEventListener('keydown', onKeyDown.bind(null, game));
  }
}
