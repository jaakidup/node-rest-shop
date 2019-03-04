const express = require('express');
const router = express();
const domain = require('../shared/domain');
const checkAuth = require('../middleware/check-auth');

// const Order = require('../models/order');
// const Product = require('../models/product');

const OrdersController = require('../controllers/orders');




router.get('/', checkAuth, OrdersController.get_all);

router.get('/:orderId', checkAuth, OrdersController.get_order);

router.get('/info', OrdersController.get_api_info);

router.post('/', checkAuth, OrdersController.create_order);

router.delete('/:orderId', checkAuth, OrdersController.delete_order);



module.exports = router;
