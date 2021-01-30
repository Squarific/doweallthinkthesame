const questions = require('./../data/questions.js');

class QuestionRoom {
  constructor (name) {
    super(name);
    
    setInterval();
  }
  
  /**
   * Join the socket to this room
   */
  join (socket) {
    this._join();  // Call base class private join
    this.__join(); // Call our private join
  }
  
  __join () {
    
  }
}

module.exports = QuestionRoom;