const express = require('express');
const router = express();

const Product = require('../model/product');
const domain = require('../shared/domain');

const checkAuth = require('../middleware/check-auth');

const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(new Error("File upload destination error."), './uploads/');
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // cb(null, file.filename);
        // cb(new Error("File upload filename error."), new Date().toDateString() + file.originalname);
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // will store the file
    } else {
        cb(null, false); // won't store the file
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});




router.get('/info', (req, res, next) => {
    // console.log(Product.schema.tree);

    const apidoc = [
        {
            request: {
                type: "GET",
                description: "Get all products",
                url: domain + "/products"
            }
        },
        {
            request: {
                type: "GET",
                description: "Get product with ID:string",
                url: domain + "/products/:ID"
            }
        },
        {
            request: {
                type: "POST",
                description: "Create product",
                url: domain + "/products/",
                body: {
                    name: "String",
                    price: "Number",
                    productImage: "String"
                }
            }
        },
        {
            request: {
                type: "PATCH",
                description: "Update product with ID:String",
                url: domain + "/products/:ID",
                body: [
                    {
                        "propName": "name",
                        "value": "String"
                    },
                    {
                        "propName": "price",
                        "value": "Number"
                    }, {
                        "propName": "productImage",
                        "value": "String"
                    }
                ]
            }
        },
        {
            request: {
                type: "DELETE",
                description: "Delete product with ID:string",
                url: domain + "/products/:ID"
            }
        },
    ];

    res.status(200).json(apidoc);
});


router.get('/', (req, res, next) => {

    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(results => {

            const response = {
                info: {
                    version: "1",
                    request: {
                        type: "GET",
                        description: "Get info on the products API",
                        url: domain + '/products/info'
                    }
                },
                count: results.length,
                products: results.map(result => {
                    return {
                        name: result.name,
                        price: result.price,
                        _id: result._id,
                        productImage: result.productImage,
                        url: {
                            type: 'GET',
                            url: domain + '/products/' + result._id
                        }
                    }
                })
            }

            res.status(200).json(response);

        }).catch(error => {
            res.status(500).json({
                error: error
            });
        });
});


router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save().then(result => {
        res.status(201).json({
            message: "Created a product",
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                productImage: result.productImage,
                url: {
                    type: 'GET',
                    url: domain + '/products/' + result._id
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});


router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    name: result.name,
                    price: result.price,
                    id: result._id,
                    url: {
                        type: 'GET',
                        url: domain + '/products/' + result._id
                    }
                }

                res.status(200).json(response);
            } else {
                res.status(404).json({ message: "No valid entry found for provided ID" })
            }
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
});


// TODO: add function to remove image when product is deleted or updated
router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;

    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {

            const response = {
                message: "Updated product!",
                id: id,
                url: {
                    type: 'GET',
                    url: domain + '/products/' + id
                }
            }

            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
});


// TODO: add function to remove image when product is deleted or updated
router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;

    Product.deleteOne({ _id: id }).exec()
        .then(result => {
            res.status(200).json({ message: "Product deleted!" });
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
});

// // TODO: add function to remove image when product is deleted or updated
// DELETE ALL PRODUCTS
// router.delete('/', (req, res, next) => {
//     Product.deleteMany().exec().then(results => {
//         res.status(200).json(results);
//     }).catch(error => {
//         res.status(500).json({
//             error: error
//         });
//     });
// });



module.exports = router;