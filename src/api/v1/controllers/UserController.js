const { json } = require("express/lib/response");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const { CustomError } = require("../util/CustomError");

class UserController {
	updateUser = async (req, res, next) => {
		try {
			await userModel.findByIdAndUpdate(req.user._id, {
				name: req.body.name,
				gender: req.body.gender,
				phone: req.body.phone,
			});

			const user = await userModel.findById(req.user._id);

			const response = {
				user,
				message: "Update success",
			};
			return res.json(response);
		} catch (error) {
			if (!error.message) error.message = "Something went wrong";
			next(error);
		}
	};

	changePassword = async (req, res, next) => {
		try {
			let user = req.user;
			const SALT_ROUNDS = 10;
			if (!bcrypt.compareSync(req.body.oldPassword, user.password))
				throw new CustomError(400, "Wrong password");

			const hashPassword = bcrypt.hashSync(req.body.newPassword, SALT_ROUNDS);

			user.password = hashPassword;
			user.save();

			user = await userModel.findById(req.user._id);

			const response = {
				user,
				message: "Update success",
			};
			return res.json(response);
		} catch (error) {
			if (!error.message) error.message = "Something went wrong";
			next(error);
		}
	};

	getAllUser = async (req, res, next) => {
		try {
			const users = await userModel.find();

			const response = {
				users,
			};
			return res.json(response);
		} catch (error) {
			if (!error.message) error.message = "Something went wrong";
			next(error);
		}
	};
}

module.exports = new UserController();
