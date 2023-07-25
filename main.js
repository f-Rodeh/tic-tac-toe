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
} // factory function

const Game = (function(){
  const player1 = Player('Player 1', 'x');
  const player2 = Player('Player 2', 'o');

  const _players = [player1, player2]

  let _activePlayer = player1;

  const switchActivePlayer = function(){
    switch (_activePlayer) {
      case player1:
        _activePlayer = player2
        break;
      case player2:
        _activePlayer = player1
        break;
    }
  }

  const getActivePlayer = function(){
    return _activePlayer;
  }

  const getPlayerByMark = function(mark){
    let output;
    _players.forEach(player => {
      if(player.getMark() === mark) {
        output = player;
      }
    });
    return output;                                             
  }

  return {
    switchActivePlayer,
    getActivePlayer,
    getPlayerByMark,
    player1,
    player2
  }
})() // IIFE module

const Modal = function(title, msg){
  const _root = _createElement('div', 'modal');
  const _body = _createElement('div', 'body');
  const _title = _createElement('h1', 'title', title);
  const _msg = _createElement('p', 'message', msg);
  const _actions = _createElement('div', 'actions');
  const _confirm = _createElement('button', 'confirm', "Let's Go!");
  const _deny = _createElement('button', 'deny', 'No thanks');

  const display = function(){
    _actions.append(_confirm, _deny)
    _body.append(_title, _msg, _actions);
    _root.append(_body);
    document.body.append(_root);
  }

  const dismiss = function(){
    _root.remove();
  }

  return {
    display,
    dismiss
  }

  function _createElement(type, cls, content =''){
    const element = document.createElement(type);
    element.classList.add(cls);
    element.textContent = content;
    return element;
  }
}

const Board = (function(){
  let _boardArray = [' ', ' ', ' ',' ', ' ', ' ',' ', ' ', ' ',];
  let _winner = '';

  const addMark = function(mark, position){
    _boardArray[position-1] = mark;
    if(_isResolved()) displayWinner();
  }

  const getWinner = function(){
    if(!_winner) return 'Tie';
    return Game.getPlayerByMark(_winner);
  }

  return {
    addMark,
    getWinner
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
        console.log('winner')
        return true;
      }
    }

    if (board.match('[x|o]{9}')) {
      return true;
    }
  }
})(); //IIFE module

const DOMSetup = (function(){
  const pictureP1 = document.querySelector('.player.one .pic');
  const pictureP2 = document.querySelector('.player.two .pic');

  pictureP1.setAttribute('src', Game.player1.getPicture());
  pictureP2.setAttribute('src', Game.player2.getPicture());

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

  const nameP1 = document.querySelector('.one .name input');
  const nameP2 = document.querySelector('.two .name input');

  nameP1.addEventListener('focusout',() => Game.player1.name = nameP1.value);
  nameP2.addEventListener('focusout',() => Game.player2.name = nameP2.value);

  return {}
})(); //IIFE module

function displayWinner(){
  const playAgainPrompt = 'Have another round?';
  const winner = Board.getWinner();
  let congratsModal;
  if(winner === 'Tie'){
    congratsModal = Modal("It's a tie!", 'We cannot leave it like that! '+playAgainPrompt)
  } else if(winner.name) {
    congratsModal = Modal("We have a winner!", `${winner.name} Wins! ${playAgainPrompt}`)
  } 
  congratsModal.display();
}