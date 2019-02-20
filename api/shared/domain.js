const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;

// const domain = 'http://'+ hostname +':'+ port; 
const domain = hostname +':'+ port; 


module.exports = domain;