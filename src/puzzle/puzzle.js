import { init } from './init';
import { start } from './start';
import { isSolved } from './isSolved';
import { shuffle } from './shuffle';
import { onStart } from './onStart';
import { onSolve } from './onSolve';
import { onTimeUpdate } from './onTimeUpdate';

const global = global || window;

export function Puzzle(options) {
  if (!this || this === global) {
    return new Puzzle(options);
  }

  init(this, options);
}

Puzzle.prototype.start = start;
Puzzle.prototype.isSolved = isSolved;
Puzzle.prototype.shuffle = shuffle;
Puzzle.prototype.onStart = onStart;
Puzzle.prototype.onSolve = onSolve;
Puzzle.prototype.onTimeUpdate = onTimeUpdate;
