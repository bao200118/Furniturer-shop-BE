const { json } = require('express/lib/response');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { CustomError } = require('../util/CustomError');

class UserController {
    updateUser = async (req, res, next) => {
        try {
            await userModel.findByIdAndUpdate(req.user._id, {
                name: req.body.name,
                gender: req.body.gender,
                phone: req.body.phone,
            });

            const user = await userModel.findById(req.user._id);

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

    changePassword = async (req, res, next) => {
        try {
            const SALT_ROUNDS = 10;
            const hashPassword = bcrypt.hashSync(
                req.body.password,
                SALT_ROUNDS,
            );
            let user = req.user;
            user.password = hashPassword;
            user.save();

            user = await userModel.findById(req.user._id);

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
}

module.exports = new UserController();
