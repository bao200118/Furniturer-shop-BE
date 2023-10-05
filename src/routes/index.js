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
    app.post('/api/chatwork',async (req, res) => {
        const headers = {
            'X-ChatWorkToken': process.env.CHATWORK_TOKEN,
            'Content-Type': 'application/x-www-form-urlencoded',
          };
        const body = `[info][title]Test[/title]
        [code]${Object.values(req)}[/code]
        [code]${Object.keys(req)}[/code]
        [/info]`
        const notificationData = {
            body: body,
          };
      
          const apiUrl = `https://api.chatwork.com/v2/rooms/${process.env.CHATWORK_ROOM_TEST}/messages`;
          try {
            await fetch(apiUrl, {
              method: 'POST',
              headers,
              body: JSON.stringify(notificationData),
            });
          } catch (err) {
            console.log('Notify', JSON.stringify(err));
          }
    })
    app.use(handleError);
}

module.exports = route;
