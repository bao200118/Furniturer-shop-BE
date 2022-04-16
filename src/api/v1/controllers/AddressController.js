const { json } = require('express/lib/response');
const userModel = require('../models/userModel');
const { CustomError } = require('../Util/CustomError');

class DeliveryAddressControlller {
    checkAddressExist = (arrOldAddress, newAddress) => {
        for (let i = 0; i < arrOldAddress.length; i++) {
            const oldAddress = {
                landNumber: arrOldAddress[i].landNumber,
                ward: arrOldAddress[i].ward,
                district: arrOldAddress[i].district,
                province: arrOldAddress[i].province,
            };
            if (JSON.stringify(oldAddress) === JSON.stringify(newAddress)) {
                throw new CustomError(409, 'Address already exist');
            }
        }
    };

    addAddress = async (req, res, next) => {
        try {
            const user = req.user;

            const newAddress = {
                landNumber: req.body.landNumber,
                ward: req.body.ward,
                district: req.body.district,
                province: req.body.province,
            };

            this.checkAddressExist(user.address, newAddress);

            user.address.push(newAddress);

            user.save();

            const response = {
                user,
                message: 'Add success',
            };
            return res.status(201).json(response);
        } catch (error) {
            console.log(error);
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    updateAddress = async (req, res, next) => {
        try {
            const user = req.user;
            const id = req.body.id;

            const newAddress = {
                landNumber: req.body.landNumber,
                ward: req.body.ward,
                district: req.body.district,
                province: req.body.province,
            };

            this.checkAddressExist(user.address, newAddress);

            await userModel
                .findOneAndUpdate(
                    { _id: user._id, 'address._id': id },
                    {
                        $set: {
                            'address.$.landNumber': newAddress.landNumber,
                            'address.$.ward': newAddress.ward,
                            'address.$.district': newAddress.district,
                            'address.$.province': newAddress.province,
                        },
                    },
                )
                .exec();

            const response = {
                user,
                message: 'Update success',
            };
            return res.json(response);
        } catch (error) {
            console.log(error);
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    deleteAddress = async (req, res, next) => {
        try {
            const user = req.user;
            const id = req.body.id;

            try {
                user.address.id(id).remove();
            } catch (error) {
                throw new CustomError(404, 'Address not exists');
            }

            user.save();

            const response = {
                user,
                message: 'Remove success',
            };
            return res.json(response);
        } catch (error) {
            console.log(error);
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    getAllAddress = async (req, res, next) => {
        try {
            const user = req.user;

            const response = {
                address: user.address,
            };
            return res.json(response);
        } catch (error) {
            console.log(error);
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };
}

module.exports = new DeliveryAddressControlller();
