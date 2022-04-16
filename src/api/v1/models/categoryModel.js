const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Category = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', Category);
