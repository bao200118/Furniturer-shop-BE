const express = require('express');
const { changePassword } = require('../api/v1/controllers/UserController');
const router = express.Router();

const userController = require('../api/v1/controllers/UserController');
const {
    verifyTokenAndAuthorization,
} = require('../api/v1/middleware/verifyToken');

router.use(verifyTokenAndAuthorization);
router.put('/', userController.updateUser);
router.put('/changePassword', userController.changePassword);

module.exports = router;
