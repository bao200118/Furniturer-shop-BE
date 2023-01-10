const authRoute = require('./auth');
const addressRoute = require('./address');
const cartRoute = require('./cart');
const categoryRoute = require('./category');
const orderRoute = require('./order');
const productRoute = require('./product');
const userRoute = require('./user');
const topRoute = require('./top');
const webhookRoute = require('./webhook');
const { handleError } = require('../api/v1/util/CustomError');

function route(app) {
    app.use('/api/auth', authRoute);
    app.use('/api/address', addressRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/category', categoryRoute);
    app.use('/api/order', orderRoute);
    app.use('/api/product', productRoute);
    app.use('/api/user', userRoute);
    app.use('/api/top', topRoute);
    app.use('/api/webhook', webhookRoute);
    app.use(handleError);
}

module.exports = route;
