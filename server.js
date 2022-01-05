//const http = require("http").createServer(app);
const https = require("https").createServer();



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
