const mongoose = require('mongoose');

async function connect(url) {
    try {
        await mongoose.connect(url);
        console.log('Success');
    } catch (error) {
        console.log('Fail');
    }
}

module.exports = { connect };
