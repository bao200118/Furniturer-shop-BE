const express = require('express');
const router = express.Router();

const cartController = require('../api/v1/controllers/CartController');
const {
    verifyTokenAndAuthorization,
} = require('../api/v1/middleware/verifyToken');

router.use(verifyTokenAndAuthorization);

//Get all product
router.get('/', cartController.getAllProductInCart);

router.post('/', cartController.addProductToCart);
router.put('/', cartController.updateCart);
// Make cart empty
router.delete('/emptycart', cartController.makeCartEmpty);

module.exports = router;
