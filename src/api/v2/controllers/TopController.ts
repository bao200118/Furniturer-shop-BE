import { NextFunction, Request, Response } from "express";
import productModel from "../../v2/models/productModel";

interface AndConditonObject {
	$and: Array<Object>;
}
class TopController {
	getTopProduct = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const startTime = Date.now();
			const parameters = req.body;
			const page = Number.parseInt(req.query.page as string);
			const pageSize = Number.parseInt(req.query.pageSize as string);
			const condition = [{ $and: [] }];
			// Determine with a group filter conditon product split by or
			let indexOrConjunction = 0;
			let sort = "ASC";
			for (let index = 0; index < parameters.length; index++) {
				const param = parameters[index];
				if (param == null) continue;
				switch (Object.keys(param)[0]) {
					case "product":
						this.filterProduct(condition, indexOrConjunction, param.product);
						break;
					case "category":
						this.filterCategory(condition, indexOrConjunction, param.category);
						break;
					case "conjunction":
						if (index === parameters.length - 1 || index === 0) break;
						indexOrConjunction = this.filterConjunction(
							condition,
							indexOrConjunction,
							param.conjunction
						);
						break;
					case "price":
						sort = this.filterPrice(param);
				}
			}
			let product;
			if (condition[0].$and.length === 0) {
				product = await productModel
					.find()
					.limit(pageSize || 3)
					.skip((page - 1) * pageSize || 0)
					.sort({ price: sort })
					.exec();
			} else {
				product = await productModel
					.find()
					.or(condition)
					.limit(pageSize || 3)
					.skip((page - 1) * pageSize || 0)
					.sort({ price: sort })
					.exec();
			}
			const response = {
				product,
			};
			const endTime = Date.now();
			console.log("Time:" + (endTime - startTime));
			return res.json(response);
		} catch (error: any) {
			if (!error.message) error.message = "Something went wrong";
			next(error);
		}
	};
	private filterProduct = (
		condition: Array<AndConditonObject>,
		indexOrConjunction: number,
		product: string
	) => {
		condition[indexOrConjunction].$and.push({
			name: { $regex: product[0].toUpperCase() + product.substring(1) },
		});
	};

	private filterConjunction = (
		condition: Array<AndConditonObject>,
		indexOrConjunction: number,
		conjunction: string
	) => {
		if (conjunction === "or") {
			condition.push({ $and: [] });
			return indexOrConjunction + 1;
		}
		return indexOrConjunction;
	};

	private filterCategory = (
		condition: Array<AndConditonObject>,
		indexOrConjunction: number,
		category: string
	) => {
		condition[indexOrConjunction].$and.push({ category });
	};

	private filterPrice = (price: string) => {
		if (price === "maximum") {
			return "DESC";
		}
		return "ASC";
	};
}

module.exports = new TopController();
