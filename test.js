const Player = function(name, mark){
  let _mark = mark;
  let _picture = randomPicture();

  const getPicture = function(){
    return _picture;
  }

  const changePicture = function(){
    _picture = randomPicture();
    return _picture;
  }

  const getMark = function(){
    return _mark;
  }

  const toggleMark = function(){
    if( _mark === 'x' ){
      _mark = 'o'
    } else if ( _mark === 'o' ){
      _mark === 'x'
    } else {
      throw new Error('Invalid player mark');
    }
  }

  const getMarkIcon = function (){
    return mark === 'x' ? 'close-outline' : 'ellipse-outline';
  }

  return {
    name,
    getPicture,
    changePicture,
    getMark,
    toggleMark,
    getMarkIcon
  }

  function randomPicture(){
    const characters = ['asuka','gendo','kaji','maya','misato','penpen','rei','ritsuko','shinji']
    const random = Math.random() * characters.length;
    const index = Math.floor(random);
    const character = characters[index];

    return `./img/pfp-${character}.jpg`
  }
}

const Modal = function(title, action){

  const _root  = createElement('div', 'modal');
  const _body  = createElement('div', 'body');
  const _title = createElement('h1', 'title', title);
  const _msg   = createElement('p', 'message');

  const _actions = createElement('div', 'actions');
  const _confirm = createElement('button', 'confirm', "Let's Go!");
  const _deny    = createElement('button', 'deny', 'No thanks');

  const setMessage = function(msg){
    _msg.textContent = msg;
  }

  const dismiss = function(){
    _root.remove();
  }

  _deny.addEventListener('click', dismiss);
  _root.addEventListener('click', (e) => {
    if(e.target === _root) dismiss()
  });

  const display = function(){
    _actions.append(_confirm, _deny)
    _body.append(_title, _msg, _actions);
    _root.append(_body);
    document.body.append(_root);
  }

  return {
    setMessage,
    display,
    dismiss
  }

  function createElement(type, cls, content = ''){
    const element = document.createElement(type);
    element.classList.add(cls);
    element.textContent = content;
    return element;
  }
}

const Score = (function(){
  let _winner;

  const evaluate = function( board ){
    board.join('');
    if(!isResolved( board )) return;
    displayWinner();
    updateScores();
  }

  return {
    evaluate
  }

  function displayWinner(){
    let title, msg;
    if( _winner === 'Tie' ){
      title = `It's a tie!`;
      msg = `We can't leave it like that! Play another round?`;
    } else if ( _winner.name ){
      title = `${_winner.name} wins!`
      msg = `Cool, huh? Let's play another round!`
    }
    const congratsModal = Modal(title, makeNewRound);
    congratsModal.setMessage(msg);
    congratsModal.display();
  }

  function updateScores(){
    // TODO: build
  }

  function getBoardLines(){
    return {
      row1: board.substring(0,3),
      row2: board.substring(3,6),
      row3: board.substring(6,9),
      colA: board[0] + board[3] + board[6],
      colB: board[1] + board[4] + board[7],
      colC: board[2] + board[5] + board[8],
      diagonal1: board[0] + board[4] + board[8],
      diagonal2: board[2] + board[4] + board[6],
    }
  }

  function isResolved( board ){
    const boardLines = getBoardLines();

    for (const key in boardLines) {
      if (!Object.hasOwnProperty.call(boardLines, key)) {return}
      if(boardLines[key].match('xxx|ooo')){
        _winner = boardLines[key][1];
        return true;
      }
    }
    if (board.match('[x|o]{9}')) {
      return true;
    }
  }
})();

const PlayerManager = (function(){
  const player1 = Player('Player 1', 'x');
  const player2 = Player('Player 2', 'o');
  
  const _activePlayer = player1;
  const getActivePlayer = function(){
    return _activePlayer;
  }

  const toggleActivePlayer = function(){
    if( _activePlayer === player1 ){
      _activePlayer = player2
    } else if ( _activePlayer === player2 ){
      _activePlayer === player1
    } else {
      throw new Error('Active player invalid');
    }
  }

  const toggleMarks = function(){
    player1.toggleMark;
    player2.toggleMark;
  }

  return {
    player1,
    player2,
    getActivePlayer,
    toggleActivePlayer,
    toggleMarks,
  }
})()

const Board = (function(){
  const spaces = document.querySelectorAll('.mark');
  const board = [' ', ' ', ' ',' ', ' ', ' ',' ', ' ', ' '];

  const reset = function(){
    spaces.forEach(space => {
      const empty = document.createElement('ion-icon');
      empty.classList.add('mark');
      space.replaceWith(empty);
    });

    setListeners();
  }

  return {
    reset
  }

  function setListeners(){
    for (let i = 0; i < spaces.length; i++) {
      const space = spaces[i];
      space.addEventListener('click', () => {
        addMark(i);
        Score.evaluate(board);
      })
    }
  }

  function addMark( position ){
    if( spaces[position].name ) return;
    const activePlayer = PlayerManager.getActivePlayer();
    board[position-1] = activePlayer.getMark;
    spaces[position].name = activePlayer.getMarkIcon;
    PlayerManager.toggleActivePlayer();
  }
})()

function makeNewRound(){ // TODO: call
  PlayerManager.toggleMarks;
  Board.reset();
}