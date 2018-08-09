'use strict';

(function(global){
  const tiles = [];

  let options = {
    tileSize: 120,
    rows: 4,
    columns: 4,
  };

  let stage;

  function init(userOptions) {
    if (!userOptions.imageUrl) {
      throw new Error('You MUST specify the image to use.');
    }

    // Override default options with user options
    Object.assign(options, userOptions);
    stage = createStage();

    createTiles();
    renderTiles();

  };

  function createStage() {
    const tileWrapper = document.createElement('div');
    tileWrapper.style.width = `${options.tileSize * options.columns}px`;
    tileWrapper.style.height = `${options.tileSize * options.rows}px`;
    return tileWrapper;
  }

  function createTiles() {
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
        tileElement.style.transition = 'transform 200ms linear';

        
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

        bindEvents(tile)

        tiles.push(tile);

        order++;
      }
    } 
  }

  function bindEvents(tile) {
    tile.tileElement.addEventListener('click', onTileClick.bind(tile));
  }

  function onTileClick(event) {
    moveTile(this);
  }

  function moveTile(tile) {
    const topTile = findTileInPosition(tile.x, tile.y - 1);
    const rightTile = findTileInPosition(tile.x + 1, tile.y);
    const bottomTile = findTileInPosition(tile.x, tile.y + 1);
    const leftTile = findTileInPosition(tile.x - 1, tile.y);
    
    const emptyTile = findEmptyTile([topTile, rightTile, bottomTile, leftTile]);

    if (!emptyTile) {
      return;
    }
  
    const tileTransform = `translate(${emptyTile.x * options.tileSize}px, ${emptyTile.y * options.tileSize}px)`;
    const emptyTileTransform = `translate(${tile.x * options.tileSize}px, ${tile.y * options.tileSize}px)`
    tile.tileElement.style.transform = tileTransform;
    emptyTile.tileElement.style.transform = emptyTileTransform;

    swapTiles(tile, emptyTile);
  }

  function findEmptyTile (t) {
    return t.filter(tile => (tile && tile.isEmpty) === true)[0];
  }

  function swapTiles (tile1, tile2) {
    const {x, y} = tile1;

    tile1.x = tile2.x;
    tile1.y = tile2.y;
    tile2.x = x;
    tile2.y = y;
  }

  function findTileInPosition(px, py) {
    const matches = tiles.filter(tile => {
      return tile.x === px && tile.y === py;
    })
    return matches[0];
  }

  function renderTiles() {
    // TODO: Do validation on stage

    if (tiles.length < 0) {
      return;
    }

    for (let i = 0; i < tiles.length; i++) {
      stage.appendChild(tiles[i].tileElement);
    }
  }

  function TileGame(options) {
    if (this === global) {
      return new TileGame();
    }

    init(options);

    return stage;
  }

  global.TileGame = TileGame;

})(window);
