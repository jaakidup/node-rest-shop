const express = require('express');
const app = express();
const morgan = require('morgan');

// API Routes definitions
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');



app.use(express.json());

// HTTP request logger, see documentation for other settings
app.use(morgan('dev'));

// routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// .use is to run a middleware
// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It works!"
//     });
// });

module.exports = app;