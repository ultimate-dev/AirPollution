//const http = require("http").createServer(app);



/**
 * Port Configuration
 */
const PORT = process.env.PORT || 3000;

/**
 * Listen Port
 */
app.listen(PORT, () =>
  console.log(`Server Started: http://localhost:${PORT}`)
);
