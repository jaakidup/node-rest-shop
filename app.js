const express = require('express');
const app = express();

// const productRoutes = require('./api/routes/products');

const productRoutes = require('./api/routes/products');


app.use('/products', productRoutes);

// .use is to run a middleware
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It works!"
//     });
// });

module.exports = app;