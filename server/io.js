const socketIo = require("socket.io");

class SocketIo {
  static instance;

  static init(server) {
    SocketIo.instance = socketIo(server, {
      cors: {
        origin: "*",
      },
    });
  }

  static start() {
    if (!SocketIo.instance) {
      throw Error ("socket.io instance not initialized");
    }

    SocketIo.instance.on("connection", (client) => {
      console.log(client.id, "has connected");

      client.on("joinPoll", (pollId) => {
        console.log(client.id, "has joined", pollId);
        client.join(pollId);
      });

      client.on("message", (data) => {
        console.log(data);
        SocketIo.instance.to(data.pollId).emit("message", data.message);
      });

      client.on("disconnect", () => {
        console.log(client.id, "has disconnected");
      });
    });
  }
}

module.exports = SocketIo;
