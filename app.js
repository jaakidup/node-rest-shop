const express = require('express');
const app = express();
const morgan = require('morgan');


// API Routes definitions
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


app.use(morgan('dev'));


// routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// .use is to run a middleware
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It works!"
//     });
// });

module.exports = app;