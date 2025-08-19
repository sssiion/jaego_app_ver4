// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products/category/:category', productController.getProductsByCategory);
router.get('/products/:productId', productController.getProductDetail);
router.put('/batches/:batchId', productController.updateBatch);

module.exports = router;
