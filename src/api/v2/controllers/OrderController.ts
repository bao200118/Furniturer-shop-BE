import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import orderModel from "../models/orderModel";

class OrderController {
	createOrderByChatbot = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const body = req.body;
			const authHeader = req.headers.authorization;
			let newOrder: any;
      newOrder = {
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
			if (authHeader) {
				let accessToken = authHeader.split(" ")[1];
				jwt.verify(
					accessToken,
					process.env.ACCESS_TOKEN_SECRET as Secret,
					{ ignoreExpiration: true },
					(error: any, decode) => {
						if (!error) {
              const payload = decode as JwtPayload
              newOrder.customerID = payload.id;
						}
					}
				);
			}


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
