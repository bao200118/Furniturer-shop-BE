const express = require('express');
const router = express.Router();

const categoryControlller = require('../api/v1/controllers/CategoryController');
const {
    verifyTokenAndAuthorizationAdmin,
} = require('../api/v1/middleware/verifyToken');

//Get all product
router.get('/', categoryControlller.getAllCategory);
//Get all product by category
router.get('/:categoryName', categoryControlller.getAllProductByCategoryName);

router.use(verifyTokenAndAuthorizationAdmin);

router.post('/', categoryControlller.addCategory);
router.put('/:id', categoryControlller.updateCategory);
router.delete('/:id', categoryControlller.deleteCategory);

module.exports = router;
