import { NextFunction, Request, Response } from "express";
import productModel from "../../v2/models/productModel";

interface AndConditonObject {
	$and: Array<Object>;
}
class TopController {
	getTopProduct = async (req: Request, res: Response, next: NextFunction) => {
		try {
            const parameters = req.body;
			const condition = [{ $and: [] }];
			// Determine with a group filter conditon product split by or
			let indexOrConjunction = 0;
            let sort = "DESC";
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
                        if(index == parameters.length - 1) break;
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
            const product = await productModel.find().limit(3).or(condition).sort({price: sort}).exec();
			const response = {
				product,
			};
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
		condition[indexOrConjunction].$and.push({ name: { $regex: product[0].toUpperCase() + product.substring(1) } });
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

    private filterPrice = (
		price: string
	) => {
        if (price === "maximum") {
            return "DESC"
        }
        return "ASC"
	};
}

module.exports = new TopController();
