const express = require('express');
const router = express.Router();

const authController = require('../api/v1/controllers/AuthController');

router.post('/sign-up', authController.register);
router.post('/sign-in', authController.login);
router.post('/sign-in-seller', authController.login);
router.post('/refresh', authController.refresh);

module.exports = router;
