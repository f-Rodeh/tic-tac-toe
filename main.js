const Game = (function(){
  const PLAYER_1 = 0;
  const PLAYER_2 = 1;

  let _activePlayer = PLAYER_1;

  const switchActivePlayer = function(){
    if (_activePlayer = PLAYER_1){
      _activePlayer = PLAYER_2;
    }
    _activePlayer = PLAYER_1;
  }

  return {
    switchActivePlayer,
  }
})()

const DisplayController = (function(){

  return {}
})(); //IIFE module

const Board = (function(){
  let _boardArray = [];

  return {}
})(); //IIFE module

const Player = function( name ) {
  let _mark = ''; // x | o
  let _picture = _randomizePicture();

  const getPicture = function(){
    return _picture;
  }

  const getMark = function (){
    return _mark;
  }

  return {
    name,
    getPicture,
    getMark,
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

const player1 = Player('Player 1');
const player2 = Player('Player 2');

const picturePlayerOne = document.querySelector('.player.one .pic');
const picturePlayerTwo = document.querySelector('.player.two .pic');

picturePlayerOne.setAttribute('src', player1.getPicture());
picturePlayerTwo.setAttribute('src', player2.getPicture());
