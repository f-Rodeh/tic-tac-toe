const Player = function(name, mark, id){
  let _mark = mark;
  let _picture = randomPicture();
  const _id = id;

  const getId = function(){
    return _id;
  }

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
    getMarkIcon,
    getId
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

  _confirm.addEventListener('click', action)
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

const PlayerManager = (function(){
  const player1 = Player('Player 1', 'x', 'player1');
  const player2 = Player('Player 2', 'o', 'player2');
  const _players = [player1, player2];

  let _activePlayer = player1;
  const getActivePlayer = function(){
    return _activePlayer;
  }

  const toggleActivePlayer = function(){
    if( _activePlayer === player1 ){
      _activePlayer = player2
    } else if ( _activePlayer === player2 ){
      _activePlayer = player1
    } else {
      throw new Error('Active player invalid');
    }
  }

  const toggleMarks = function(){
    player1.toggleMark;
    player2.toggleMark;
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
    player1,
    player2,
    getActivePlayer,
    toggleActivePlayer,
    toggleMarks,
    getPlayerByMark
  }
})();

const Score = (function(){
  let _winnersMark;
  let _scores = {
    player1: 0,
    player2: 0
  }

  const evaluate = function( board ){
    board.join('');
    if(!isResolved( board )) return;
    displayWinner();
    updateScores();
  }

  return {
    evaluate,
  }

  function displayWinner(){
    const winner = PlayerManager.getPlayerByMark(_winnersMark);
    let title, msg;
    if( _winnersMark === 'Tie' ){
      title = `It's a tie!`;
      msg = `We can't leave it like that! Play another round?`;
    } else if ( winner.name ){
      incrementScore(winner.getId());
      title = `${winner.name} wins!`
      msg = `Cool, huh? Let's play another round!`
    }
    const congratsModal = Modal(title, () => {
      makeNewRound();
      congratsModal.dismiss();
    });
    congratsModal.setMessage(msg);
    congratsModal.display();
  }

  function incrementScore( id ){
    _scores[id]++
  }

  function updateScores(){
    const scoreP1 = document.querySelector('.one .score');
    const scoreP2 = document.querySelector('.two .score');

    scoreP1.textContent = _scores.player1;
    scoreP2.textContent = _scores.player2;
  }

  function getLines(board){
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

  function isResolved( boardArr ){
    const board = boardArr.join('');
    const boardLines = getLines(board);

    for (const key in boardLines) {
      if (!Object.hasOwnProperty.call(boardLines, key)) {return}
      if(boardLines[key].match('xxx|ooo')){
        _winnersMark = boardLines[key][1];
        return true;
      }
    }
    if (board.match('[x|o]{9}')) {
      return true;
    }
  }
})();

const Board = (function(){
  const spaces = document.querySelectorAll('.gameboard .mark');
  const board = [' ', ' ', ' ',' ', ' ', ' ',' ', ' ', ' '];
  setListeners();

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
    board[position] = activePlayer.getMark();
    spaces[position].name = activePlayer.getMarkIcon();
    PlayerManager.toggleActivePlayer();
  }
})()

const DOMSetup = (function(){
  const pictureP1 = document.querySelector('.player.one .pic');
  const pictureP2 = document.querySelector('.player.two .pic');

  pictureP1.setAttribute('src', PlayerManager.player1.getPicture());
  pictureP2.setAttribute('src', PlayerManager.player2.getPicture());

  const nameP1 = document.querySelector('.one .name input');
  const nameP2 = document.querySelector('.two .name input');

  nameP1.addEventListener('focusout',() => PlayerManager.player1.name = nameP1.value);
  nameP2.addEventListener('focusout',() => PlayerManager.player2.name = nameP2.value);

  return {}
})(); //IIFE module

function makeNewRound(){
  PlayerManager.toggleMarks;
  Board.reset();
}