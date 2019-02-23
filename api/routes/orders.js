const express = require('express');
const router = express();
const domain = require('../shared/domain');
const checkAuth = require('../middleware/check-auth');

// const Order = require('../models/order');
// const Product = require('../models/product');

const OrdersController = require('../controllers/orders');




router.get('/', checkAuth, OrdersController.orders_get_all);

router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

router.get('/info', OrdersController.orders_get_api_info);

router.post('/', checkAuth, OrdersController.orders_create_order);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);



module.exports = router;
