const authRoute = require('./auth');

function route(app) {
    app.use('/api/auth', authRoute);
}

module.exports = route;
