const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Order = new Schema({
    customerID: { type: Schema.Types.ObjectId, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    products: [
        {
            //Product ID
            product: { type: Schema.Types.ObjectId, default: '' },
            quantity: { type: Number, default: 0 },
        },
    ],
    totalPrice: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    paymentMethod: { type: String, default: 'cash' },
    status: { type: String, default: 'Create order' },
    note: { type: String, default: '' },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', Order);
