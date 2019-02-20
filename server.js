const http =  require('http');
const app = require('./app');

// Get the port from the runtime, ie some cloud provider, otherwise, use port:3000
// add PORT to nodemon.json with a value
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});