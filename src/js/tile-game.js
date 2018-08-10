'use strict';

(function(global){
  
  const duration = 200;

  let defaultOptions = {
    tileSize: 120,
    rows: 4,
    columns: 4,
    dificulty: 1,
  };

  const inverseAxes = {
    x: 'y',
    y: 'x',
  };

  function init(gameInstance, userOptions) {
    if (!userOptions.imageUrl) {
      throw new Error('You MUST specify the image to use.');
    }

    gameInstance.tiles = [];

    // Override default options with user options
    gameInstance.options = Object.assign({}, defaultOptions, userOptions);{};
    
    gameInstance.stage = createStage(gameInstance);
    
    createTiles(gameInstance);
    renderTiles(gameInstance);
    // shuffleTiles(gameInstance);
    return gameInstance.stage;
  };

  function createStage(gameInstance) {
    const { options } = gameInstance;
    const stageElem = document.createElement('div');
    stageElem.style.position = 'relative';
    stageElem.style.width = `${options.tileSize * options.columns}px`;
    stageElem.style.height = `${options.tileSize * options.rows}px`;

    return stageElem;
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
        
        tileElement.style.width = `${options.tileSize}px`;
        tileElement.style.height = `${options.tileSize}px`;
        tileElement.style.position = `absolute`;
        tileElement.style.left = '0';
        tileElement.style.top = '0';
        tileElement.style.transform = `translate(${left}px, ${top}px)`;
        tileElement.style.transition = `transform ${duration}ms linear`;

        
        if (!isEmpty) {
          tileElement.style.backgroundImage = `url(${options.imageUrl})`;
          tileElement.style.backgroundRepeat = 'no-repeat';
          tileElement.style.backgroundPosition = `-${left}px -${top}px`;
          tileElement.style.backgroundSize = `auto ${options.columns * options.tileSize}px`;
        }

        const tile = {
          x,
          y,
          order,
          isEmpty,
          tileElement,
        };

        bindEvents(gameInstance, tile);
        tiles.push(tile);
        order++;
      }
    } 
  }

  function bindEvents(gameInstance, tile) {
    tile.tileElement.addEventListener('click', onTileClick.bind({ gameInstance, tile }));
  }

  function onTileClick(event) {
    const { gameInstance, tile } = this;
    handleMoveManyTiles(gameInstance, tile);
  }

  function moveOneTile(gameInstance, tile) {
    const tileCollection = findNeighbouringTiles(gameInstance, tile);
    const emptyTile = findEmptyTile(tileCollection);

    if (!emptyTile) {
      return;
    }
  
    swapTiles(gameInstance, tile, emptyTile);
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

  function swapTiles(gameInstance, tile, emptyTile) {
    const { options } = gameInstance;
    // visual swapping (This must be done before logical swapping.)
    const tileTransform = `translate(${emptyTile.x * options.tileSize}px, ${emptyTile.y * options.tileSize}px)`;
    const emptyTileTransform = `translate(${tile.x * options.tileSize}px, ${tile.y * options.tileSize}px)`;
    tile.tileElement.style.transform = tileTransform;
    emptyTile.tileElement.style.transform = emptyTileTransform;

    // logical swapping
    const { x, y, order } = tile;

    tile.x = emptyTile.x;
    tile.y = emptyTile.y;
    tile.order = emptyTile.order;
    emptyTile.x = x;
    emptyTile.y = y;
    emptyTile.order = order;
  }

  function findTileInPosition(gameInstance, px, py) {
    const { tiles } = gameInstance;
    const matches = tiles.filter(tile => {
      return tile.x === px && tile.y === py;
    })
    return matches[0];
  }

  function moveRandomTile(gameInstance, excludedTile) {
    const { tiles } = gameInstance;
    const emptyTile = findEmptyTile(tiles);
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

  function TileGame(options) {
    if (!this || this === global) {
      return new TileGame(options);
    }
    
    init(this, options);
  }

  TileGame.prototype.isSolved = function() {
    const { tiles } = this;

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];

      if (tile.order !== i) {
        return false;
      }
    }
    
    return true;
  }

  TileGame.prototype.shuffle = function() {
    const { options } = this;

    return new Promise(resolve => {
      let times = Math.floor(options.dificulty * 6) * options.columns * options.columns;
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

  // export game object
  global.TileGame = TileGame;

})(window);
