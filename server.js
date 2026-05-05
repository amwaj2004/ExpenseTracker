const http = require('http');
const app = require('./backend/app');
const debug = require('debug')('node-angular');

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

const PORT = normalizePort(process.env.PORT || 3000);
app.set('port', PORT);

const server = http.createServer(app);

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log(`Server running on http://localhost:${PORT}`);
};

const onError = (error) => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof PORT === 'string' ? 'pipe ' + PORT : 'port ' + PORT;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.on('error', onError);
server.on('listening', onListening);
server.listen(PORT);
