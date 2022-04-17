const { json } = require('express/lib/response');
const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productModel');
const { CustomError } = require('../Util/CustomError');

class CategoryController {
    addCategory = async (req, res, next) => {
        try {
            const category = await categoryModel.findOne({
                name: req.body.name,
            });

            let newCategorySave;

            //Check if category is exists
            if (category) {
                throw new CustomError(403, 'Category already exists');
            } else {
                const newCategory = {
                    name: req.body.name,
                    description: req.body.description,
                };

                newCategorySave = await categoryModel.create(newCategory);
            }

            const response = {
                newCategorySave,
                message: 'Add success',
            };

            return res.status(201).json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    updateCategory = async (req, res, next) => {
        try {
            let category = await categoryModel.findOne({
                name: req.body.name,
            });

            if (category) {
                throw new CustomError(403, 'Category already exists');
            } else {
                try {
                    await categoryModel
                        .findByIdAndUpdate(req.params.id, {
                            name: req.body.name,
                            description: req.body.description,
                        })
                        .exec();
                } catch (error) {
                    throw new CustomError(404, 'Category not exists');
                }
            }

            category = await categoryModel.findById(req.params.id);

            const response = {
                category,
                message: 'Update success',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    deleteCategory = async (req, res, next) => {
        try {
            try {
                await categoryModel.findByIdAndRemove(req.params.id).exec();
            } catch (error) {
                throw new CustomError(404, 'Category not exists');
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

    getAllCategory = async (req, res, next) => {
        try {
            const category = await categoryModel.find();

            const response = {
                category,
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    getAllProductByCategoryName = async (req, res, next) => {
        try {
            const listProduct = await productModel.find({
                category: req.params.categoryName,
            });

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

module.exports = new CategoryController();
