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

const ScoreManager = (function(){
  const evaluate = function( board ){
    // decide the winner
    displayWinner();
    // update the scores
  }

  return {
    evaluate
  }

  function displayWinner(){
    const congratsModal = Modal('Winner', makeNewRound);
    if( winner === 'Tie' ){
      congratsModal.setMessage('TODO: set tie message');
    } else if ( winner.name ){
      congratsModal.setMessage('TODO: set win message');
    }
    congratsModal.display();
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

  return {
    player1,
    player2,
    getActivePlayer,
    toggleActivePlayer,
  }
})()

const Board = (function(){
  const spaces = document.querySelectorAll('.mark');
  const board = [' ', ' ', ' ',' ', ' ', ' ',' ', ' ', ' '];
  let winner;

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
      space.addEventListener('click', addMark(i))
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

function makeNewRound(){
  // Assign the scores (player manager)
  reset();
}