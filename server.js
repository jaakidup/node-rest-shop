const http =  require('http');
const app = require('./app');
// Get the port from the runtime, ie some cloud provider, otherwise, use port:3000
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);