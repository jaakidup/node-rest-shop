const express = require('express');
const app = express();
const morgan = require('morgan');

const mongoose = require('mongoose');

// API Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


mongoose.connect('mongodb+srv://atlas:'+process.env.MONGO_ATLAS_PW+'@node-rest-shop-70ldp.gcp.mongodb.net/node-rest-shop?retryWrites=true', { useNewUrlParser: true }).then((result) =>{
        // console.log(result)    
}).catch(error => console.log(error));

// This is to handle the deprecation warning
// mongoose.Promise = global.Promise



// middleware to parse incoming json body data
app.use(express.json());
// HTTP request logger, see documentation for other settings
app.use(morgan('dev'));

app.use('/uploads', express.static("uploads")); // make the uploads folder publicly available

// Let's handle the CORS requests
app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', "https://only.my.cool.url.com");
    res.header('Access-Control-Allow-Origin', "*"); // Allow all requesting URLS
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Headers', '*'); // allow all headers

    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


// routes that handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Error handling middleware, 
// this will catch all routes that didn't match any of the above
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














