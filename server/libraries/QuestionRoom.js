const questions = require('./../data/questions.js');
const questionMap = questions.map((q) => { questionText: q });

const QUESTION_INTERVAL = 70 * 1000;
const SERVER = { socketIdInRoom: -1 };

const Room = require('./Room.js');

class QuestionRoom {
  constructor (name) {
    this.room = new Room(name);
    this.currentTimeout;
    this.currentQuestion = 0;
    this.questions = shuffle([...questionMap]);
    
    this._newRandomQuestion();
  }
  
  join (socket) {
    this.room.join(socket);
    this.startOrContinueInterval();
    this.room.sendFromToTarget(SERVER, socket, "question;" + this.room.sockets.length + ";" + this.secondsTillNextQuestion() + ";" + this.getCurrentQuestion());
  }
  
  leave (socket) {
    this.room.leave(socket);
  }
  
  getCurrentQuestion () {
    return this.questions[this.currentQuestion % this.questions.length].questionText;
  }
  
  startOrContinueInterval () {
    if (this.currentTimeout) return;
    this.currentTimeout = setTimeout(this.newQuestionAndUpdateSockets.bind(this), QUESTION_INTERVAL);
    this.lastTimeoutStart = Date.now();
  }
  
  ensureActiveClients () {
    this.room.ensureActiveClients();
  }
  
  newQuestionAndUpdateSockets () {
    delete this.currentTimeout;
    
    // If there are sockets in this room, continue generating new questions
    this.room.ensureActiveClients();
    if (this.room.sockets.length !== 0) this.startOrContinueInterval();
    
    this.currentQuestion = (this.currentQuestion + 1) % this.questions.length;
    
    // Send everyone a new question as the server
    this.room.broadcastFrom(SERVER, "question;" + this.room.sockets.length + ";" + this.secondsTillNextQuestion() + ";" + this.getCurrentQuestion());
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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


module.exports = QuestionRoom;