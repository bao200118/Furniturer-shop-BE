import { NextFunction, Request, Response } from "express";
import orderModel from "../../v2/models/orderModel";

class OrderController {
	createOrderByChatbot = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const body = req.body;
			const newOrder = {
				customerID: "000000000000000000000000",
				customerName: body.customerName,
				phone: body.phone,
				address: body.address,
				products: body.products,
				totalPrice: body.totalPrice,
				isPaid: false,
				paymentMethod: "Cash on delivery",
				note: "Chatbot create order",
			};

			const newOrderSave = await orderModel.create(newOrder);

			const response = {
				newOrderSave,
				message: "Add success",
			};

			return res.status(201).json(response);
		} catch (error: any) {
			if (!error.message) error.message = "Something went wrong";
			next(error);
		}
	};
}

module.exports = new OrderController();
