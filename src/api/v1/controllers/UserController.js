const res = require('express/lib/response');

class AuthController {
    // [GET] /news
    async register(req, res) {
        const username = req.body.username;
        const user = await userModel;
    }

    // [GET] /news/:slug
    show(req, res) {
        res.send('NEW DETAIL');
    }
}

module.exports = new AuthController();
