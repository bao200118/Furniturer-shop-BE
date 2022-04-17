const express = require('express');
const router = express.Router();

const productController = require('../api/v1/controllers/ProductController');
const {
    verifyTokenAndAuthorizationAdmin,
} = require('../api/v1/middleware/verifyToken');

// Get all product
router.get('/', productController.getAllProduct);
//Get product by list id
router.post('/getProductByListID', productController.getAllProductByListID);

router.use(verifyTokenAndAuthorizationAdmin);

router.post('/', productController.addProduct);
router.post('/:id/inStock', productController.changeProductInStock);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
