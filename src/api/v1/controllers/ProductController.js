const { json } = require('express/lib/response');
const { findByIdAndUpdate } = require('../models/productModel');
const productModel = require('../models/productModel');
const { CustomError } = require('../util/CustomError');

class ProductController {
    addProduct = async (req, res, next) => {
        try {
            const product = await productModel.findOne({
                name: req.body.name,
                size: req.body.size,
                color: req.body.color,
                material: req.body.material,
                weight: req.body.weight,
                price: req.body.price,
            });

            let newProductSave;

            //Check if product is exists
            if (product) {
                if (req.body.image.length) product.image.push(req.body.image);
                product.description = req.body.description;
                product.inStock += req.body.inStock;
                product.save();
            } else {
                const newProduct = {
                    name: req.body.name,
                    category: req.body.category,
                    image: req.body.image,
                    description: req.body.description,
                    size: req.body.size,
                    color: req.body.color,
                    material: req.body.material,
                    weight: req.body.weight,
                    inStock: req.body.inStock,
                    price: req.body.price,
                };

                newProductSave = await productModel.create(newProduct);
            }

            const response = {
                newProductSave,
                message: 'Add success',
            };

            return res.status(201).json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    updateProduct = async (req, res, next) => {
        try {
            let product = await productModel.findOne({
                name: req.body.name,
                size: req.body.size,
                color: req.body.color,
                material: req.body.material,
                weight: req.body.weight,
                price: req.body.price,
            });

            if (product) {
                throw new CustomError(403, 'Product already exists');
            } else {
                try {
                    await productModel
                        .findByIdAndUpdate(req.params.id, {
                            name: req.body.name,
                            category: req.body.category,
                            image: req.body.image,
                            description: req.body.description,
                            size: req.body.size,
                            color: req.body.color,
                            material: req.body.material,
                            weight: req.body.weight,
                            inStock: req.body.inStock,
                            price: req.body.price,
                        })
                        .exec();
                } catch (error) {
                    console.log(error);
                    throw new CustomError(404, 'Product not exists');
                }
            }

            product = await productModel.findById(req.params.id);

            const response = {
                product,
                message: 'Update success',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    deleteProduct = async (req, res, next) => {
        try {
            try {
                await productModel.findByIdAndRemove(req.params.id).exec();
            } catch (error) {
                throw new CustomError(404, 'Product not exists');
            }
            const response = {
                message: 'Remove success',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    changeProductInStock = async (req, res, next) => {
        try {
            try {
                await productModel
                    .findByIdAndUpdate(req.params.id, {
                        inStock: req.body.inStock,
                    })
                    .exec();
            } catch (error) {
                throw new CustomError(404, 'Product not exists');
            }
            const product = await productModel.findById(req.params.id);
            const response = {
                product,
                message: 'Update success',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    getAllProduct = async (req, res, next) => {
        try {
            const product = await productModel.find();

            const response = {
                product,
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    getAllProductByListID = async (req, res, next) => {
        try {
            let listProduct = [];
            let listID = req.body.listID;

            //List id must be array
            if (!Array.isArray(listID))
                throw new CustomError(400, 'List id must be array');

            for (let i = 0; i < listID.length; i++) {
                try {
                    const product = await productModel.findById(listID[i]);
                    listProduct.push(product);
                } catch (error) {}
            }

            const response = {
                products: listProduct,
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };
}

module.exports = new ProductController();
