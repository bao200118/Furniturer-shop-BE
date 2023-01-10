import { NextFunction, Request, Response } from "express";
import productModel from "../../v2/models/productModel";

interface AndConditonObject {
	$and: Array<Object>;
}
class WebhookController {
  handleDialogflowWebhook(req: Request, res: Response, next: NextFunction) {
    console.log(req);
  }
}

module.exports = new WebhookController();
