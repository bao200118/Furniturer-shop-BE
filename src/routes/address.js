const express = require('express');
const router = express.Router();

const addressController = require('../api/v1/controllers/DeliveryAddressController');

router.post('/add', authController.register);
router.post('/delete', authController.login);
router.post('/refresh', authController.refresh);

// // Default
// router.use(siteController.dashboard);

module.exports = router;
