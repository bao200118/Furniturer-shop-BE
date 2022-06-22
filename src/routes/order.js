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
router.get('/:id', orderController.getOrderById);

router.post('/', orderController.addOrder);
router.put('/:id', orderController.updateOrder);

router.use(verifyTokenAndAuthorizationAdmin);
//get all customer order which have paid
router.get('/customerPaidOrder/all', orderController.getAllCustomerPaidOrder);
router.put('/:id/cancel', orderController.cancelledOrder);
router.put('/:id/changestatus/:status', orderController.updateOrderStatus);

module.exports = router;
