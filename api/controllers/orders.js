const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');
const domain = require('../shared/domain');

exports.get_all = (req, res, next) => {

    Order.find()
        .select('_id quantity product')
        .exec()
        .then(results => {
            res.status(200).json({
                count: results.length,
                info: {
                    version: "1",
                    request: {
                        type: 'GET',
                        description: 'Info on Orders API',
                        url: domain + '/orders/info'
                    }
                },
                orders: results.map(result => {
                    return {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity,
                        request: {
                            type: 'GET',
                            description: 'Get a single order',
                            url: domain + '/orders/' + result._id
                        }
                    }
                })
            });
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
};


exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found!'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        }).then(result => {
            res.status(201).json({
                message: 'Order created!',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    description: 'Get a single order',
                    url: domain + '/orders/' + result._id
                }
            });
        }).catch(error => {
            res.status(500).json({
                error: error
            });
        });
};


exports.get_order = (req, res, next) => {
    const id = req.params.orderId;

    Order.findById(id)
        .select("_id quantity product")
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found!'
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    description: 'Get all orders',
                    url: domain + "/orders/"
                }
            });
        })
        .catch(error => {
            res.status(404).json({
                message: 'Order not found!'
            });
        });
};


exports.delete_order = (req, res, next) => {
    const id = req.params.orderId;

    Order.findByIdAndDelete({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted!'
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error
            });
        });
};


exports.get_api_info = (req, res, next) => {
    const apidoc = [
        {
            request: {
                type: "GET",
                description: "Get all orders",
                url: domain + "/orders"
            }
        },
        {
            request: {
                type: "GET",
                description: "Get order with ID:string",
                url: domain + "/orders/:ID"
            }
        },
        {
            request: {
                type: "POST",
                description: "Create order",
                url: domain + "/orders/",
                body: {
                    productId: "String",
                    quantity: "Number"
                }
            }
        },
        {
            request: {
                type: "DELETE",
                description: "Delete order with ID:string",
                url: domain + "/orders/:ID"
            }
        },
    ];
    res.status(200).json(apidoc);
};