const express = require('express');
const router = express.Router();

const categoryControlller = require('../api/v1/controllers/CategoryController');
const {
    verifyTokenAndAuthorizationAdmin,
} = require('../api/v1/middleware/verifyToken');

//Get all product
router.get('/', categoryControlller.getAllAddress);
//Get all product by category
router.get('/:categoryName', categoryControlller.getAllAddress);

router.use(verifyTokenAndAuthorizationAdmin);

router.post('/', categoryControlller.addAddress);
router.put('/:id', categoryControlller.updateAddress);
router.delete('/:id', categoryControlller.deleteAddress);

module.exports = router;
