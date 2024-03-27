//HTTP import
const http = require("http");

//Express server
const app = require("./app");

//Returns valid port whether a string or number is provided
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN) return val;

  if (port >= 0) return port;

  return false;
};

//Default port or port of environment variable
const port = normalizePort(process.env.PORT || '3000');

//Setting the port to use
app.set("port", port);

//Error handlerr
const errorHandler = err => {
    if (error.syscall !== 'listen') throw error;

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe '+ address : 'port: ' + port;
    switch (error.code){
        case 'EACCCESS':
            console.error(bind + 'requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + 'is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

const server = http.createServer(app);

server.on('error', errorHandler);

server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe '+ address : 'port: ' + port;
    console.log('Listening on ' + bind)   
})

server.listen(port);
