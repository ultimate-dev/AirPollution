const app = require("./app");
//const http = require("http").createServer(app);
const https = require("https").createServer(app);
const io = require("socket.io")(https);

io.on("connection", (socket) => {
  console.log("SOCKET - Connection");
  socket.on("disconnect", function () {
    console.log("SOCKET - Disconnect");
  });
});

app.set("io", io);

/**
 * Port Configuration
 */
const PORT = process.env.PORT || 3000;

/**
 * Listen Port
 */
https.listen(PORT, () =>
  console.log(`Server Started: http://localhost:${PORT}`)
);
