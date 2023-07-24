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
  let _boardArray = [' ', ' ', ' ',' ', ' ', ' ',' ', ' ', ' ',];
  let _winner = '';

  const addMark = function(mark, position){
    _boardArray[position-1] = mark;
    if(_isResolved()) alert(`Winner: ${_winner}`)
  }

  const getWinnerMark = function(){
    if(_winner) return _winner;
  }

  return {
    addMark,
    getWinnerMark
  }

  function _isResolved() {
    const board = _boardArray.join('');

    const blocks = {
      row1: board.substring(0,3),
      row2: board.substring(3,6),
      row3: board.substring(6,9),
      colA: board[0] + board[3] + board[6],
      colB: board[1] + board[4] + board[7],
      colC: board[2] + board[5] + board[8],
      diagonal1: board[0] + board[4] + board[8],
      diagonal2: board[2] + board[4] + board[6],
    }

    for (const key in blocks) {
      if (!Object.hasOwnProperty.call(blocks, key)) {return}

      if(blocks[key].match('xxx|ooo')){
        _winner = blocks[key][1];
        return true;
      }
    }
  }
})(); //IIFE module

const Display = (function(){
  const pictureP1 = document.querySelector('.player.one .pic');
  const pictureP2 = document.querySelector('.player.two .pic');

  pictureP1.setAttribute('src', player1.getPicture());
  pictureP2.setAttribute('src', player2.getPicture());

  const _boardSpaces = document.querySelectorAll('.mark');
  for (let i = 0; i < _boardSpaces.length; i++) {
    const space = _boardSpaces[i];

    space.addEventListener('click', () => {
      const player = Game.getActivePlayer();
      if( space.name ){ return } // space is already taken
      Board.addMark( player.getMark(), i );
      space.name = player.getMarkIcon();
      Game.switchActivePlayer();
    })
  }

  return {}
})(); //IIFE module