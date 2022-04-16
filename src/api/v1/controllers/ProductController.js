const { json } = require('express/lib/response');
const productModel = require('../models/productModel');
const { CustomError } = require('../Util/CustomError');

class ProductController {
    addProduct = async (req, res, next) => {
        try {
            const product = await productModel.findOne({
                category: req.body.category,
                name: req.body.name,
                size: req.body.size,
                color: req.body.color,
                material: req.body.material,
                weight: req.body.weight,
                price: req.body.price,
            });

            //Check if product is exists
            if (product.length) {
                if (req.body.image) product.image.push(req.body.image);
                product.description = req.body.description;
                product.inStock += req.body.inStock;
                product.save();
            } else {
                const newProduct = {
                    name: req.body.name,
                    image: req.body.image,
                    description: req.body.description,
                    size: req.body.size,
                    color: req.body.color,
                    material: req.body.material,
                    weight: req.body.weight,
                    inStock: req.body.inStock,
                    price: req.body.price,
                };

                const newSaveProduct = await productModel.create(newProduct);
            }
            const response = {
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

module.exports = new ProductController();
