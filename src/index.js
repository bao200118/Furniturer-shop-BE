const express = require('express');
const dotenv = require('dotenv');
const db = require('../src/config/db');
var cors = require('cors');

dotenv.config();

const route = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

db.connect(
    process.env.MONGO_URL ||
        'mongodb+srv://admin:admin@furnitureshopcluster.5qmau.mongodb.net/furnitureShop',
);

route(app);

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

module.exports = app;