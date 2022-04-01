const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('express/lib/response');

const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');
const { CustomError } = require('../middleware/ErrorHandler');

class AuthController {
    // [GET] /news
    async register(req, res, next) {
        try {
            const email = req.body.email;
            const user = await userModel.findOne({ email });
            if (user) {
                throw new CustomError(401, 'Email already exists');
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

            const newSavedUser = await userModel.create(newUser);
            const { _id, password, ...other } = newSavedUser._doc;

            const newCart = {
                id: _id,
                product: [],
            };
            const newSavedCart = await cartModel.create(newCart);

            const response = {
                data: other,
                status: 201,
                message: 'Sign-up success',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = await userModel.findOne({ email });
            if (!user) {
                throw new CustomError(401, 'Email not exists');
            }

            console.log(password);
            console.log(user.password);

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                throw new CustomError(401, 'Wrong password');
            }

            const accessToken = jwt.sign(
                {
                    id: user._id,
                    isSeller: user.isSeller,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    algorithm: 'HS256',
                    expiresIn: process.env.ACCESS_TOKEN_LIFE,
                },
            );

            const refreshToken = jwt.sign(
                {
                    id: user._id,
                    isSeller: user.isSeller,
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    algorithm: 'HS256',
                    expiresIn: process.env.REFRESH_TOKEN_LIFE,
                },
            );

            const response = {
                data: {
                    accessToken,
                    refreshToken,
                    user: email,
                },
                status: 201,
                message: 'Sign-in success',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                throw new CustomError(400, 'Cannot find refresh token');
            }

            const decode = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
            );
            if (!decode) {
                throw new CustomError(400, 'Refresh token is invalid');
            }

            const user = await userModel.findOne(decode.payload.id);
            if (!user) {
                throw new CustomError(401, 'User not exists');
            }
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    }
}

module.exports = new AuthController();
