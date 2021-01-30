const questions = require('./../data/questions.js');
const QUESTION_INTERVAL = 2 * 60 * 1000;
const SERVER = { socketIdInRoom: -1 };

const Room = require('./Room.js');

class QuestionRoom {
  constructor (name) {
    this.room = new Room(name);
    this.currentInterval;
    this.currentQuestion = "";
    
    this._newRandomQuestion();
  }
  
  join (socket) {
    this.room.join(socket);
    this.room.sendFromToTarget(SERVER, socket, "question;" + this.room.sockets.length + ";" + this.currentQuestion);
    this.startInterval();
  }
  
  leave (socket) {
    this.room.leave(socket);
  }
  
  startInterval () {
    if (this.currentInterval) return;
    this.currentInterval = setInterval(this.newQuestionAndUpdateSockets.bind(this), QUESTION_INTERVAL);
  }
  
  stopInterval () {
    delete this.currentInterval;
    clearInterval(this.currentInterval);
  }
  
  ensureActiveClients () {
    this.room.ensureActiveClients();
  }
  
  _newRandomQuestion () {
    let randomIndex = Math.floor(Math.random() * questions.length);
    
    // Ensure we do not get the same question
    // Also ensure it is within bounds of the question array
    if (questions[randomIndex] == this.currentQuestion)
      randomIndex = (randomIndex + 1) % questions.length;
    
    this.currentQuestion = questions[randomIndex];
  }
  
  newQuestionAndUpdateSockets () {
    // If there are no sockets in this room, stop generating new questions
    this.room.ensureActiveClients();
    if (this.room.sockets.length == 0) {
      return this.stopInterval();
    }
    
    // Send everyone a new question as the server
    this._newRandomQuestion();
    this.room.broadcastFrom(SERVER, "question;" + this.room.sockets.length + ";" + this.currentQuestion);
  }
  
  broadcastFrom (from, message) {
    this.room.broadcastFrom(from, message);
  }
  
  sendFromToTarget (from, target, message) {
    this.room.sendFromToTarget(from, target, message);
  }
}

module.exports = QuestionRoom;