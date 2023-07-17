const http = require("http");
const socket = require("socket.io");

const server = http.createServer();
const io = socket(server);

server.listen(8900);

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log("Received message: " + message);
  });
});
