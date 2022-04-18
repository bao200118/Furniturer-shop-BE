const { json } = require('express/lib/response');
const orderModel = require('../models/orderModel');
const { CustomError } = require('../Util/CustomError');

class OrderController {
    addOrder = async (req, res, next) => {
        try {
            const newOrder = {
                customerID: req.user._id,
                customerName: req.body.customerName,
                phone: req.body.phone,
                address: req.body.address,
                products: req.body.products,
                totalPrice: req.body.totalPrice,
                isPaid: req.body.isPaid,
                paymentMethod: req.body.paymentMethod,
                status: req.body.status,
                note: req.body.note,
            };

            const newOrderSave = await orderModel.create(newOrder);

            const response = {
                newOrderSave,
                message: 'Add success',
            };

            return res.status(201).json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    cancelledOrder = async (req, res, next) => {
        try {
            let order;
            try {
                order = await orderModel.findById(req.params.id);
            } catch (error) {
                throw new CustomError(404, 'Order not exists');
            }

            if (!order.customerID.equals(req.user._id))
                throw new CustomError(
                    401,
                    "You don't have permission to do this",
                );

            await orderModel
                .findOneAndUpdate(
                    { _id: req.params.id },
                    { status: 'Cancelled' },
                )
                .exec();

            order = await orderModel.findById(req.params.id);

            const response = {
                order,
                message: 'Order have cancelled',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    updateOrderStatus = async (req, res, next) => {
        try {
            let order;
            //Check id order is correct
            try {
                order = await orderModel.findById(req.params.id);
            } catch (error) {
                throw new CustomError(404, 'Order not exists');
            }

            if (order.status != 'Cancelled') {
                await orderModel
                    .findOneAndUpdate(
                        { _id: req.params.id },
                        { status: req.params.status },
                    )
                    .exec();
            } else throw new CustomError(403, 'Order have cancelled');

            order = await orderModel.findById(req.params.id);

            const response = {
                order,
                message: 'Order change status success',
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };

    getAllOrder = async (req, res, next) => {
        try {
            const order = await orderModel.find({
                customerID: req.user._id,
            });

            const response = {
                order,
            };
            return res.json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    };
}

module.exports = new OrderController();
