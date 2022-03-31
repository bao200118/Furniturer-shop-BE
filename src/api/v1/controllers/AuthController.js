const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('express/lib/response');

const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');

class AuthController {
    // [GET] /news
    async register(req, res, next) {
        const error = new Error();
        try {
            const email = req.body.email;
            const user = await userModel.findOne({ email });
            if (user) {
                error.status = 401;
                error.message = 'Email already exists';
                next(error);
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
            error.message = 'Something went wrong';
            next(error);
        }
    }

    async login(req, res, next) {
        const error = new Error();
        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = await userModel.findOne({ email });
            if (!user) {
                error.status = 401;
                error.message = 'Email not exists';
                next(error);
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                error.status = 401;
                error.message = 'Wrong password';
                next(error);
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
            error.message = 'Something went wrong';
            next(error);
        }
    }

    async refresh(req, res, next) {
        const error = new Error();
        try {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                error.status = 400;
                error.message = 'Cannot find refresh token';
                next(error);
            }

            const decode = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
            );
            if (!decode) {
                error.status = 400;
                error.message = 'Refresh token is invalid';
                next(error);
            }
        } catch (error) {
            error.message = 'Something went wrong';
            next(error);
        }
    }
}

module.exports = new AuthController();
