const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017'


module.exports = () => {
    const connect = () => {
        mongoose.connect(
            DB_URI,
            {
                keepAlive: true,
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            (err) => {
                
            },
        )

    }
}