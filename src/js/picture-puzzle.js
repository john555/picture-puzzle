'use strict';

(function(global){
  
  const duration = 150;

  let defaultOptions = {
    tileSize: 120,
    rows: 4,
    columns: 4,
    difficulty: 4,
    scale: 1,
  };

  const inverseAxes = {
    x: 'y',
    y: 'x',
  };

  const keyDirections = {
    37: 'right',
    38: 'bottom',
    39: 'left',
    40: 'top',
    83: 'top',
    87: 'bottom',
    65: 'right',
    68: 'left',
  };

  function init(gameInstance, userOptions) {
    if (!userOptions.imageUrl) {
      throw new Error('You MUST specify the image to use.');
    }

    gameInstance.tiles = [];
    gameInstance.isPlaying = false;
    gameInstance.time = 0;

    // Override default options with user options
    gameInstance.options = Object.assign({}, defaultOptions, userOptions);{};
    
    gameInstance.stage = createStage(gameInstance);
    
    createTiles(gameInstance);
    renderTiles(gameInstance);
    bindEvents(gameInstance);
    // shuffleTiles(gameInstance);
    return gameInstance.stage;
  };

  function createStage(gameInstance) {
    const { options } = gameInstance;
    const stageElem = document.createElement('div');
  
    addStyle(stageElem, {
      position: 'relative',
      width: `${options.tileSize * options.columns}px`,
      height: `${options.tileSize * options.rows}px`,
    });

    return stageElem;
  }

  function addStyle(element, styleObject) {
    if (!element || element.nodeType !== 1) {
      throw new Error(`addSstyle(${element}, ${styleObject}) failed.`);
    }

    for (let property in styleObject) {
      if (styleObject.hasOwnProperty(property)) {
        element.style[property] = styleObject[property]
      }
    }
  }

  function createTiles(gameInstance) {
    const { options, tiles } = gameInstance;
    let order = 0;

    for (let y = 0; y < options.rows; y++) {
      for (let x = 0; x < options.columns; x++) {
        const tileElement = document.createElement('div');
        const left = x * options.tileSize;
        const top = y * options.tileSize;
        const isEmpty = order === (options.rows * options.columns - 1);

        addStyle(tileElement, {
          width: `${options.tileSize}px`,
          height:`${options.tileSize}px`,
          position:`absolute`,
          left: '0',
          top:'0',
          transform: `translate(${left}px, ${top}px) scale(${options.scale})`,
          transition: `transform ${duration}ms linear`,
          zIndex: 1,
        });
        
        if (!isEmpty) {
          addStyle(tileElement, {
            backgroundImage: `url(${options.imageUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `-${left}px -${top}px`,
            backgroundSize: `auto ${options.columns * options.tileSize}px`,
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

        bindTileEvents(gameInstance, tile);
        tiles.push(tile);
        order++;
      }
    } 
  }

  function bindTileEvents(gameInstance, tile) {
    tile.tileElement.addEventListener('click', onTileClick.bind({ gameInstance, tile }));
    tile.tileElement.addEventListener('transitionend', onTransitionEnd(gameInstance));
  }

  function bindEvents(gameInstance) {
    if (global.addEventListener && typeof global.addEventListener === 'function') {
      global.addEventListener('keydown', onKeyDown.bind(null, gameInstance));
    }
  }

  function onKeyDown(gameInstance, event) {
    if (!gameInstance.isPlaying) {
      return;
    }

    const emptyTile = findEmptyTile(gameInstance.tiles);

    switch(keyDirections[event.keyCode]) {
      case 'top':
        const topTile = findTileInPosition(gameInstance, emptyTile.x, emptyTile.y - 1);

        if (!topTile) {
          return;
        }

        swapTiles(gameInstance, topTile, emptyTile);
      break;
      case 'right':
        const rightTile = findTileInPosition(gameInstance, emptyTile.x + 1, emptyTile.y);

        if (!rightTile) {
          return;
        }

        swapTiles(gameInstance, rightTile, emptyTile);
      break;
      case 'bottom':
        const bottomTile = findTileInPosition(gameInstance, emptyTile.x, emptyTile.y + 1);
        
        if (!bottomTile) {
          return;
        }

        swapTiles(gameInstance, bottomTile, emptyTile);
      break;
      case 'left':
        const leftTile = findTileInPosition(gameInstance, emptyTile.x - 1, emptyTile.y);
        
        if (!leftTile) {
          return;
        }

        swapTiles(gameInstance, leftTile, emptyTile);
      break;
    }
  }

  function onTransitionEnd(gameInstance) {
    return function() {
      if (gameInstance.isPlaying && gameInstance.isSolved()) {
        clearInterval(gameInstance.timer);
        const solveEvent = new Event('solve');

        // Subtract 1 in order to match this time 
        // with the value sent via the timeupdate event
        solveEvent.time = gameInstance.time - 1;
        gameInstance.stage.dispatchEvent(solveEvent);
        gameInstance.isPlaying = false;
      }
    }
  }

  function onTileClick() {
    if (!this.gameInstance.isPlaying) {
      return;
    }

    const { gameInstance, tile } = this;
    handleMoveManyTiles(gameInstance, tile);
  }

  function handleMoveManyTiles(gameInstance, lastTile) {
    const { tiles } = gameInstance;
    const emptyTile = findEmptyTile(tiles);
    const axis = getMatchingAxis(emptyTile, lastTile);

    if (!axis) {
      return;
    }

    const iAxis = inverseAxes[axis];
    const startTile = (lastTile[iAxis] < emptyTile[iAxis]) ? lastTile : emptyTile;
    const endTile = (lastTile[iAxis] < emptyTile[iAxis]) ? emptyTile : lastTile;

    const movingTiles = getTilesInRange(gameInstance, emptyTile, startTile, endTile, axis);

    moveManyTiles(gameInstance, movingTiles, iAxis);
  }

  function moveManyTiles(gameInstance, tiles, varyingAxis) {
    // When first tile is empty
    const firstTile = tiles[0];

    if (!firstTile) {
      return;
    }

    if (firstTile.isEmpty) {
      // move first tile to the end
      for (let i = 1; i < tiles.length; i++) {
        swapTiles(gameInstance, firstTile, tiles[i])
      }
      return;
    }

    const lastTile = tiles[tiles.length - 1];

    if (!lastTile) {
      return;
    }

    for (let i = tiles.length - 1; i >= 0; i--) {
      swapTiles(gameInstance, lastTile, tiles[i]);
    }
  }

  function getTilesInRange(gameInstance, emptyTile, startTile, endTile, axis) {
    const { tiles } = gameInstance;

    const iAxis = inverseAxes[axis];
    
    const range = tiles.filter(tile => {
      
      const isInRange = (tile[iAxis] >= startTile[iAxis]) && (tile[iAxis] <= endTile[iAxis]);
      return isInRange && (tile[axis] === emptyTile[axis]);
    });

    return range.sort((a, b) => a[iAxis] > b[iAxis]);
  }

  function getMatchingAxis(tile1, tile2) {
    if (tile1.x === tile2.x) {
      return 'x';
    }
    
    if (tile1.y === tile2.y) {
      return 'y';
    }
  }

  function findNeighbouringTiles(gameInstance, tile) {
    const topTile = findTileInPosition(gameInstance, tile.x, tile.y - 1);
    const rightTile = findTileInPosition(gameInstance, tile.x + 1, tile.y);
    const bottomTile = findTileInPosition(gameInstance, tile.x, tile.y + 1);
    const leftTile = findTileInPosition(gameInstance, tile.x - 1, tile.y);

    return [topTile, rightTile, bottomTile, leftTile].filter(tile => tile);
  }

  function findEmptyTile(tiletileCollection) {
    return tiletileCollection.filter(tile => (tile && tile.isEmpty) === true)[0];
  }

  function swapTiles(gameInstance, tile, tile2) {
    const { options } = gameInstance;
    // visual swapping (This must be done before logical swapping.)
    const tileTransform = `translate(${tile2.x * options.tileSize}px, ${tile2.y * options.tileSize}px) scale(${options.scale})`;
    const emptyTileTransform = `translate(${tile.x * options.tileSize}px, ${tile.y * options.tileSize}px) scale(${options.scale})`;
    
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

  function findTileInPosition(gameInstance, px, py) {
    const { tiles } = gameInstance;
    const matches = tiles.filter(tile => {
      return tile.x === px && tile.y === py;
    })
    return matches[0];
  }

  function moveRandomTile(gameInstance, excludedTile) {
    const emptyTile = findEmptyTile(gameInstance.tiles);
    let tileCollection = findNeighbouringTiles(gameInstance, emptyTile);

    // remove excluded tile from collection
    tileCollection = tileCollection.filter(tile => tile !== excludedTile);

    const targetTile = getRandomTileFromCollection(tileCollection);
    swapTiles(gameInstance, targetTile, emptyTile);
    return targetTile;
  }

  function getRandomTileFromCollection(tileCollection) {
    let randomIndex = Math.floor(Math.random() * tileCollection.length);
    if (randomIndex === tileCollection.length) {
      randomIndex -= 1;
    }
    return tileCollection[randomIndex];
  }

  function renderTiles(gameInstance) {
    const { tiles, stage } = gameInstance;
    // TODO: Do validation on stage

    if (tiles.length < 0) {
      return;
    }

    for (let i = 0; i < tiles.length; i++) {
      stage.appendChild(tiles[i].tileElement);
    }
  }

  function updateTime(gameInstance) {
    const timeUpdateEvent = new Event('timeupdate');
    timeUpdateEvent.time = gameInstance.time++;
    gameInstance.stage.dispatchEvent(timeUpdateEvent);
  }

  function PicturePuzzle(options) {
    if (!this || this === global) {
      return new PicturePuzzle(options);
    }
    
    init(this, options);
  }

  PicturePuzzle.prototype.start = function() {
    if (this.isPlaying) {
      return new Promise(resolve => {
        resolve();
      });
    }

    return this.shuffle().then(() => {
      this.isPlaying = true;
      updateTime(this);
      this.timer = setInterval(() => {
        updateTime(this);
      }, 1000);

      this.stage.dispatchEvent(new Event('start'));
    });
  }

  PicturePuzzle.prototype.isSolved = function() {
    const { tiles } = this;

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];

      if (tile.order !== i) {
        return false;
      }
    }

    return true;
  };

  PicturePuzzle.prototype.shuffle = function() {
    const { options } = this;

    return new Promise(resolve => {
      let times = Math.floor(Math.abs(options.difficulty * options.columns * options.columns));
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
  };

  PicturePuzzle.prototype.onStart = function(callback) {
    this.stage.addEventListener('start', callback);
  };

  PicturePuzzle.prototype.onSolve = function(callback) {
    this.stage.addEventListener('solve', event => {
      clearInterval(this.timer);
      callback.call(this, event);
      this.time = 0;
    });
  };

  PicturePuzzle.prototype.onTimeUpdate = function(callback) {
    this.stage.addEventListener('timeupdate', callback);
  };

  // export game object
  global.PicturePuzzle = PicturePuzzle;

})(window);
