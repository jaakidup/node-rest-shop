const express = require('express');
const router = express();

const ProductsController = require("../controllers/products");

const checkAuth = require('../middleware/check-auth');

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


router.get('/', ProductsController.products_get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);

// router.delete('/', ProductsController.products_delete_all_products);

router.get('/info', ProductsController.products_api_info);


module.exports = router;