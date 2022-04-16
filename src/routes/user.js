const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();

const add = require('../api/v1/controllers/AuthController');

router.use(verify);
router.post('/sign-up', authController.register);
router.post('/sign-in', authController.login);
router.post('/refresh', authController.refresh);

// // Default
// router.use(siteController.dashboard);

module.exports = router;
