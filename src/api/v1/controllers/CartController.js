const { json } = require('express/lib/response');
const { default: mongoose } = require('mongoose');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const { CustomError } = require('../util/CustomError');

class CartController {
    addProductToCart = async (req, res, next) => {
        try {
            if (!(await productModel.findById(req.body.productID))) {
                throw new CustomError(400, 'Product not exists');
            }

            let userCart = await cartModel.findOne({ id: req.user._id });
            const productDuplicate = userCart.products.find((value) => {
                return value.product == req.body.productID;
            });

            console.log(typeof req.body.quantity);

            if (productDuplicate) {
                userCart = await cartModel.findOneAndUpdate(
                    {
                        id: req.user._id,
                        'products.product': new mongoose.Types.ObjectId(
                            req.body.productID,
                        ),
                    },
                    {
                        $set: {
                            'products.$.quantity':
                                productDuplicate.quantity + +req.body.quantity,
                        },
                    },
                    {
                        new: true,
                    },
                );
            } else {
                userCart.products.push({
                    product: req.body.productID,
                    quantity: req.body.quantity,
                });
                userCart = await userCart.save();
            }

            const response = {
                userCart,
                message: 'Add success',
            };
            return res.status(201).json(response);
        } catch (error) {
            console.log(error);
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    updateCart = async (req, res, next) => {
        try {
            const updateCart = await cartModel.findOneAndUpdate(
                { id: req.user._id },
                {
                    products: req.body.products,
                },
                {
                    new: true,
                },
            );

            const response = {
                updateCart,
                message: 'Update success',
            };
            return res.json(response);
        } catch (error) {
            console.log(error);
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    makeCartEmpty = async (req, res, next) => {
        try {
            const updateCart = await cartModel.findOneAndUpdate(
                { id: req.user._id },
                {
                    products: [],
                },
                {
                    new: true,
                },
            );

            const response = {
                updateCart,
                message: 'Cart is now empty success',
            };
            return res.json(response);
        } catch (error) {
            console.log(error);
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    getAllProductInCart = async (req, res, next) => {
        try {
            const cart = await cartModel.findOne({ id: req.user._id });

            const response = {
                products: cart.products,
            };
            return res.json(response);
        } catch (error) {
            console.log(error);
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };
}

module.exports = new CartController();
