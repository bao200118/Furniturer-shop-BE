const express = require('express');
const { changePassword } = require('../api/v1/controllers/UserController');
const router = express.Router();

const userController = require('../api/v1/controllers/UserController');
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAuthorizationAdmin,
} = require('../api/v1/middleware/verifyToken');

router.use(verifyTokenAndAuthorization);
router.put('/', userController.updateUser);
router.put('/changepassword', userController.changePassword);

router.use(verifyTokenAndAuthorizationAdmin);
router.get('/all', userController.getAllUser);

module.exports = router;
