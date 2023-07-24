const Player = function( name, mark) {
  let _picture = _randomizePicture();

  const getPicture = function(){
    return _picture;
  }

  const getMark = function (){
    return mark;
  }

  const getMarkIcon = function (){
    return mark === 'x' ? 'close-outline' : 'ellipse-outline';
  }

  return {
    name,
    getPicture,
    getMark,
    getMarkIcon
  }

  // private methods
  function _randomizePicture(){
    const characters = ['asuka','gendo','kaji','maya','misato','penpen','rei','ritsuko','shinji']
    const random = Math.random() * characters.length;
    const index = Math.floor(random);
    const character = characters[index];

    return `./img/pfp-${character}.jpg`
  }
}

const player1 = Player('Player 1', 'x');
const player2 = Player('Player 2', 'o');

const players = [player1, player2]

const Game = (function(){
  const PLAYER_1 = 0;
  const PLAYER_2 = 1;

  let _activePlayer = PLAYER_1;

  const switchActivePlayer = function(){

    switch (_activePlayer) {
      case PLAYER_1:
        _activePlayer = PLAYER_2
        break;
      case PLAYER_2:
        _activePlayer = PLAYER_1
        break;
    }
  }

  const getActivePlayer = function(){
    return players[_activePlayer];
  }

  return {
    switchActivePlayer,
    getActivePlayer
  }
})() // IIFE module

const Board = (function(){
  let _boardArray = new Array(9)

  const addMark = function(mark, position){
    _boardArray[position-1] = mark;
  }

  return {
    addMark,
  }
})(); //IIFE module

const DisplayController = (function(){
  const picturePlayerOne = document.querySelector('.player.one .pic');
  const picturePlayerTwo = document.querySelector('.player.two .pic');

  picturePlayerOne.setAttribute('src', player1.getPicture());
  picturePlayerTwo.setAttribute('src', player2.getPicture());

  const _markSpaces = document.querySelectorAll('.mark');
  for (let i = 0; i < _markSpaces.length; i++) {
    const space = _markSpaces[i];

    space.addEventListener('click', () => {
      Board.addMark(Game.getActivePlayer().getMark(), i);
      space.name = Game.getActivePlayer().getMarkIcon();
      Game.switchActivePlayer();
    })
  }

  return {}
})(); //IIFE module