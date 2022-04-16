const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Cart = new Schema({
    id: { type: Schema.Types.ObjectId, required: true, unique: true },
    products: [
        {
            product: { type: String, default: '' },
            quantity: { type: Number, default: 0 },
        },
    ],
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cart', Cart);
