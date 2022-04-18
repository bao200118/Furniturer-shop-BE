const express = require('express');
const router = express.Router();

const orderController = require('../api/v1/controllers/OrderController');
const {
    verifyTokenAndAuthorizationAdmin,
    verifyTokenAndAuthorization,
} = require('../api/v1/middleware/verifyToken');

router.use(verifyTokenAndAuthorization);
// Get all order by customer ID
router.get('/', orderController.getAllOrder);

router.post('/', orderController.addOrder);

router.use(verifyTokenAndAuthorizationAdmin);
router.put('/:id/cancel', orderController.cancelledOrder);
router.put('/:id/changestatus/:status', orderController.updateOrderStatus);

module.exports = router;
