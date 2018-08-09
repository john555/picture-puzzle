'use strict';

const game = TileGame({
  tileSize: 150,
  columns: 5,
  rows: 4,
  imageUrl: 'https://images.pexels.com/photos/1307662/pexels-photo-1307662.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
});

document.getElementById('game')
  .appendChild(game);
