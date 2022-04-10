class DeliveryAddressControlller {
    async addDeliveryAddress(req, res, next) {
        try {
            const decodeData = req.decodeData;
            const user = await userModel.findOne({ _id: decodeData.id });

            const deliveryAddress = {
                landNumber: req.body.landNumber,
                ward: req.body.ward,
                district: req.body.district,
                province: req.body.province,
            };

            const [...address] = user.address;
            const newAddress = [...address, deliveryAddress];

            user.address = newAddress;
            user.save();

            user.save();

            const response = {
                user,
                message: 'Add success',
            };
            return res.status(201).json(response);
        } catch (error) {
            if (!error.message) error.message = 'Something went wrong';
            next(error);
        }
    }
}

module.exports = new DeliveryAddressControlller();
