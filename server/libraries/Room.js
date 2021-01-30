const WebSocket = require('ws');

class Room {
    constructor(name) {
        this.name = name;
        this.lastId = 0;
        this.sockets = [];
        console.log("[" + new Date().toUTCString() + "] Room " + this.name + " created");
    }

    /**
     * Join the socket to this room
     */
    join (socket) {
      this._join(socket);
    }
    
    _join (socket) {
        this.sockets.push(socket);
        this.lastId++;
        socket.roomid = this.lastId;
        this.ensureActiveClients();
        console.log("[" + new Date().toUTCString() + "] Room " + this.name + " joined, " + this.sockets.length + " active clients. Lastid: " + this.lastId);
    }

    /**
     * Leave the socket from this room
     */
    leave (socket) {
        this._leave(socket);
    }
    
    _leave (socket) {
        let index;
        while (index = this.sockets.indexOf(socket) > -1) {
            this.sockets.splice(index, 1);
        }
    }
    
    ensureActiveClients () {
      this._ensureActiveClients();
    }

    /**
     * Removes all clients that do not have an open socket
     */
    _ensureActiveClients () {
        this.sockets = this.sockets.filter((socket) => socket.readyState === WebSocket.OPEN);
    }

    /**
     * Sends a message to all sockets in this room except the one given
     * @param {Socket} Socket object containing a roomid, if not given will send message without owner
     * @param {String} message
     */
    send(from, message) {
      this._send(from, message);
    }
     
    _send (from, message) {
        let messageToSend = from.roomid + ";" + message;
        console.log("[" + new Date().toUTCString() + "] [" + this.name + "] " + messageToSend);
        
        this.ensureActiveClients();
        for (let index = 0; index < this.sockets.length; index++) {
            if (this.sockets[index] == from) continue;
            this.sockets[index].send(messageToSend);
        }
    }
}

module.exports = Room;