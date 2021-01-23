const WebSocket = require('ws');
const Room = require('./Room.js');
const rooms = {};

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
  this.room.send(this, message);
  this.lastSent = Date.now();
}
 
const wss = new WebSocket.Server({
  port: 8080,
  maxPayload: 1024
});
 
wss.on('connection', function connection(ws) {
  ws.isAlive = true;
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