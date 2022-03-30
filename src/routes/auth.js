const express = require('express');
const router = express.Router();

const authController = require('../api/v1/controllers/AuthController');

router.post('/sign-up', authController.register);
// router.post('/sign-in', authController.search);

// // Default
// router.use(siteController.dashboard);

module.exports = router;
