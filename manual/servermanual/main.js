const WebSocket = require('ws');
const Room = require('./libraries/QuestionRoom.js');
const rooms = {};

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function ask () {
  rl.question('New question: room;question', (answer) => {
    var splitted = answer.split(";");
    if (rooms[splitted[0]]) {
      rooms[splitted[0]].newQuestionAndUpdateSockets(splitted[1]);
    }
    
    setTimeout(ask, 0);
  });
}

ask();

const MIN_TIME_BETWEEN_MESSAGES_OF_ONE_CLIENT = 40;
 
function heartbeat() {
  this.isAlive = true;
}

function joinRoom (socket, room) {
  if (typeof room !== 'string' || room.length < 5 || room.length > 10) socket.terminate();
  if (!rooms[room]) rooms[room] = new Room(room);

  rooms[room].join(socket);
  socket.room = rooms[room];
}

function cleanEmptyRooms () {
  // For every room ensureActiveClients
  // if clients < 1, remove
  // TODO
  // TODO also call this every so often
}

function handleMessage (message) {
  if (Date.now() - this.lastSent < MIN_TIME_BETWEEN_MESSAGES_OF_ONE_CLIENT) return;
  if (!this.room) return joinRoom(this, message);
  if (message.length > 128) return;
  this.room.broadcastFrom(this, message);
  this.lastSent = Date.now();
}
 
const wss = new WebSocket.Server({
  port: 7846,
  maxPayload: 1024
});
 
wss.on('connection', function connection(ws, req) {
  ws.isAlive = true;
  ws.ip = req.socket.remoteAddress;
  ws.on('pong', heartbeat);
  ws.on('message', handleMessage);
  ws.lastSent = 0;
});
 
const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
 
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
 
wss.on('close', function close() {
  clearInterval(interval);
});