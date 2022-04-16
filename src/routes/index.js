const authRoute = require('./auth');
const addressRoute = require('./address');
const { handleError } = require('../api/v1/util/CustomError');

function route(app) {
    app.use('/api/auth', authRoute);
    app.use('/api/address', addressRoute);

    app.use(handleError);
}

module.exports = route;
