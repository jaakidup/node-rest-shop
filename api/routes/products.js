const express = require('express');
const router = express();

const mongoose = require('mongoose');
const Product = require('../model/product');


router.get('/info', (req, res, next) => {
    console.log(Product.schema.tree);

    res.status(200).json({
        message: "Definition of Product",
        product: Product({ name: "some name", price: 23423 }),
        schema: Product.schema.tree
    });
});


router.get('/', (req, res, next) => {

    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created a product",
            product: result
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        })
    });


});


router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                console.log("From db: ", doc);
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "No valid entry found for provided ID" })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

    res.status(200).json({
        message: "Updated product!",
        id: id
    });



});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.deleteOne({ _id: id }).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});




module.exports = router;