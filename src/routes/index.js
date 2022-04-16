const authRoute = require('./auth');
const { handleError } = require('../api/v1/util/CustomError');

function route(app) {
    app.use('/api/auth', authRoute);

    app.use(handleError);
}

module.exports = route;
