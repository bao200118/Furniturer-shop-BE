const { json } = require('express/lib/response');
const userModel = require('../models/userModel');
const { CustomError } = require('../Util/CustomError');

class DeliveryAddressControlller {
    checkAddressExist = (arrOldAddress, newAddress) => {
        //If exists 1 address throw error "Address already exists"
        if (
            arrOldAddress.some((value) => {
                const oldAddress = {
                    landNumber: value.landNumber,
                    ward: value.ward,
                    district: value.district,
                    province: value.province,
                };

                return (
                    JSON.stringify(oldAddress) === JSON.stringify(newAddress)
                );
            })
        ) {
            throw new CustomError(409, 'Address already exists');
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
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    updateAddress = async (req, res, next) => {
        try {
            let user = req.user;
            const id = req.params.id;

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
            user = await userModel.findOne({ _id: user._id });
            const response = {
                user,
                message: 'Update success',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    deleteAddress = async (req, res, next) => {
        try {
            const user = req.user;
            const id = req.params.id;

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
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };
    getAddressByID = async (req, res, next) => {
        try {
            const user = req.user;

            const response = {
                address: user.address.id(req.params.id),
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };
}

module.exports = new DeliveryAddressControlller();
