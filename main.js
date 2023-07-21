// game module

// board module

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