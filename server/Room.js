class Room {
    constructor() {
        this.sockets = [];
    }

    /**
     * Join the socket to this room
     */
    join (socket) {
        this.sockets.push(socket);
    }

    /**
     * Leave the socket from this room
     */
    leave (socket) {
        let index;
        while (index = this.sockets.indexOf(socket) > -1) {
            this.sockets.splice(index, 1);
        }
    }

    ensureActiveClients () {
        this.sockets = this.sockets.filter((socket) => socket.readyState === WebSocket.OPEN);
    }

    send (message) {
        this.ensureActiveClients();
        for (let index = 0; index < this.sockets.length; index++) {
            this.sockets[index].send(message);
        }
    }
}

export default Room;