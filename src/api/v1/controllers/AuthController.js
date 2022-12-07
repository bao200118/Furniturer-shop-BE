const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { json } = require('express/lib/response');

const userModel = require('../models/userModel');
const cartModel = require('../models/cartModel');
const { CustomError } = require('../util/CustomError');
const { verifyToken } = require('../middleware/verifyToken');

class AuthController {
    async register(req, res, next) {
        try {
            //Check email is exists
            const email = req.body.email;
            const user = await userModel.findOne({ email });
            if (user) {
                throw new CustomError(409, 'Email already exists');
            }

            //Create and save user to db
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

            //Create and save cart after user is save
            const newCart = {
                id: _id,
                product: [],
            };
            const newSavedCart = await cartModel.create(newCart);

            //Return response to client
            const response = {
                data: other,
                message: 'Sign-up success',
            };
            return res.status(201).json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            // Check email is exists
            const email = req.body.email;
            const password = req.body.password;

            const user = await userModel.findOne({ email });
            if (!user) {
                throw new CustomError(404, 'Email not exists');
            }

            // Check password is correct
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                throw new CustomError(403, 'Wrong password');
            }

            //Create access token and refresh token
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

            //Save refresh token to user
            user.refreshToken = refreshToken;
            user.save();

            const response = {
                accessToken,
                refreshToken,
                user,
                message: 'Sign-in success',
            };
            return res.status(200).json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    }

    async loginSeller(req, res, next) {
        try {
            // Check email is exists
            const email = req.body.email;
            const password = req.body.password;

            const user = await userModel.findOne({ email });
            if (!user) {
                throw new CustomError(404, 'Email not exists');
            }

            if (!user.isAdmin) {
                throw new CustomError(403, "Email don't have permission");
            }

            // Check password is correct
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                throw new CustomError(403, 'Wrong password');
            }

            //Create access token and refresh token
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

            //Save refresh token to user
            user.refreshToken = refreshToken;
            user.save();

            const response = {
                accessToken,
                refreshToken,
                user,
                message: 'Sign-in success',
            };
            return res.status(200).json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            //Check access token is in body
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                throw new CustomError(400, 'Cannot find refresh token');
            }

            //Decode and check access token
            verifyToken(req, res);
            const decodeData = req.decodeData;

            //Check decode information is correct
            const user = await userModel.findOne({ _id: decodeData.id });
            if (!user) {
                throw new CustomError(404, 'User not exists');
            }

            //Check refresh token is same as token in the db
            if (user.refreshToken != refreshToken) {
                throw new CustomError(403, 'Refresh token is incorrect');
            }

            //Create new access token
            const newAccessToken = jwt.sign(
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

            const response = {
                newAccessToken,
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    }
}

module.exports = new AuthController();
