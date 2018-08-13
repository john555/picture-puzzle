# Picture Puzzle

Picture Puzzle a browser based game made of tiles. Each tile consists of a section of an picture. To solve the puzzle, you have to arrange the tiles such that the picture is displayed correctly.

### Installation requirements.
- [Node.js](https://nodejs.org/en/download/) (The latest stable version)
- [Yarn](https://yarnpkg.com/en/docs/install)
- [Gulp](https://gulpjs.com/)

__NOTE:__ You can use npm if you prefer it to yarn. 

### How to run the game in development mode.
Clone the repo.
```
git clone https://github.com/john555/picture-puzzle.git
cd picture-puzzle
```
Run the app.
```
$ yarn dev
```
Or 
```
$ npm run dev
```

## Documentation.

In order to integrate the game to your website or web app, include the `picture-puzzle.js` file in your HTML document.

```html
<div id="game"></div>
<script src="/path/to/picture-puzzle.js"></script>
```

Create the game.

```js
const game = new PicturePuzzle({
  tileSize: 100, // width and height of the tile
  columns: 4,
  rows: 4,
  difficulty: 4,
  scale: 0.996, // Determines the scale of the tiles. As scale value less than 1 reveals gridlines
  image: { 
    url: '/url/or/path/to/image', 
    preserve: 'width', //['width', 'height'] the width or height will be preserved
    offset: 0,
  } 
});

document.getElementById('game')
  .appendChild(game.stage);

```

Start the game.

```js
game.start();
```

### Events
`onSolve()` - Do something when the puzzle is solved.

```js
game.onSolve(function(event){
  alert(`You solved the puzzle in ${event.time}s`);
});
```

`onTimeUpdate()` - You can get update the timer during the course of the game.
```js
game.onTimeUpdate(function(event){
  const time = event.time;
});

```
