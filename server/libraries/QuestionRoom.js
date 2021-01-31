const questions = require('./../data/questions.js');
const QUESTION_INTERVAL = 2 * 60 * 1000;
const SERVER = { socketIdInRoom: -1 };

const Room = require('./Room.js');

class QuestionRoom {
  constructor (name) {
    this.room = new Room(name);
    this.currentTimeout;
    this.currentQuestion = "";
    
    this._newRandomQuestion();
  }
  
  join (socket) {
    this.room.join(socket);
    this.startOrContinueInterval();
    this.room.sendFromToTarget(SERVER, socket, "question;" + this.room.sockets.length + ";" + this.secondsTillNextQuestion() + ";" + this.currentQuestion);    
  }
  
  leave (socket) {
    this.room.leave(socket);
  }
  
  startOrContinueInterval () {
    if (this.currentTimeout) return;
    this.currentTimeout = setTimeout(this.newQuestionAndUpdateSockets.bind(this), QUESTION_INTERVAL);
    this.lastTimeoutStart = Date.now();
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
    delete this.currentTimeout;
    
    this._newRandomQuestion();
    
    // Send everyone a new question as the server
    this.room.broadcastFrom(SERVER, "question;" + this.room.sockets.length + ";" + this.secondsTillNextQuestion() + ";" + this.currentQuestion);
    
    // If there are sockets in this room, continue generating new questions
    this.room.ensureActiveClients();
    if (this.room.sockets.length !== 0) this.startOrContinueInterval();
  }
  
  secondsTillNextQuestion () {
    const timePassed = Date.now() - this.lastTimeoutStart;
    return Math.floor((QUESTION_INTERVAL - timePassed) / 1000);
  }
  
  broadcastFrom (from, message) {
    this.room.broadcastFrom(from, message);
  }
  
  sendFromToTarget (from, target, message) {
    this.room.sendFromToTarget(from, target, message);
  }
}

module.exports = QuestionRoom;