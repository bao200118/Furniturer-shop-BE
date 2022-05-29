const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    id: ObjectId,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: '' },
    isSeller: { type: Boolean, default: false },
    gender: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: {
        type: [
            {
                landNumber: { type: String, default: '' },
                ward: { type: String, default: '' },
                district: { type: String, default: '' },
                province: { type: String, default: '' },
            },
        ],
        default: [],
    },
    refreshToken: { type: String, default: '' },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', User);
