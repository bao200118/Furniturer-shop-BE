const express = require('express');
const router = express.Router();

const addressController = require('../api/v1/controllers/AddressController');
const {
    verifyTokenAndAuthorization,
} = require('../api/v1/middleware/verifyToken');

router.use(verifyTokenAndAuthorization);

router.get('/', addressController.getAllAddress);
router.get('/:id', addressController.getAddressByID);
router.post('/', addressController.addAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
