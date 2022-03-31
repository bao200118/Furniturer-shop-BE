const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Cart = new Schema({
    id: { type: Schema.Types.ObjectId, required: true, unique: true },
    product: { type: Array },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    deleteAt: { type: Date },
});

module.exports = mongoose.model('cart', Cart);
