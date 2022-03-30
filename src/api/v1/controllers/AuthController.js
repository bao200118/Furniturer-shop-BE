const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');
const { json } = require('express/lib/response');

class AuthController {
    // [GET] /news
    async register(req, res, next) {
        try {
            const email = req.body.email;
            let user;
            await userModel
                .findOne({ email })
                //User instance in document
                .then((userIns) => (user = userIns));
            if (user) {
                const response = {
                    status: 401,
                    message: 'Email already exist',
                };
                return res.json(response);
            }
            const SALT_ROUNDS = 10;
            const hashPassword = bcrypt.hashSync(
                req.body.password,
                SALT_ROUNDS,
            );

            const newUser = {
                email,
                password: hashPassword,
                name: req.body.name,
                gender: req.body.gender,
                phone: req.body.phone,
                address: {
                    landNumber: req.body.landNumber,
                    ward: req.body.ward,
                    district: req.body.district,
                    province: req.body.province,
                },
            };

            const newSaveUser = await userModel.create(newUser);

            const { _id } = newSaveUser;

            console.log(_id);

            const response = {
                data: newSaveUser,
                status: 201,
                message: 'Sign-up success',
            };
            return res.json(response);
        } catch (error) {
            console.log(error);
            const response = {
                status: 500,
                message: 'Something went wrong',
            };
            return res.json(response);
        }
    }
}

module.exports = new AuthController();
