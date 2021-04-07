const SERVER = { socketIdInRoom: -1 };

const Room = require('./Room.js');

class QuestionRoom {
  constructor (name) {
    this.room = new Room(name);
    this.currentQuestion = "Waiting for host...";
  }
  
  join (socket) {
    this.room.join(socket);
    this.room.sendFromToTarget(SERVER, socket, "question;" + this.room.sockets.length + ";" + this.getCurrentQuestion());
  }
  
  leave (socket) {
    this.room.leave(socket);
  }
  
  getCurrentQuestion () {
    return this.currentQuestion;
  }
  
  ensureActiveClients () {
    this.room.ensureActiveClients();
  }
  
  newQuestionAndUpdateSockets (q) {
    this.currentQuestion = q;
    // Send everyone a new question as the server
    this.room.broadcastFrom(SERVER, "question;" + this.room.sockets.length + ";" + this.getCurrentQuestion());
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