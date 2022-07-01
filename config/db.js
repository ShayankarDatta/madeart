const mongoose = require('mongoose');
const config = require('./../config.json')


module.exports = async () => {

    try {
        mongoose.connect(config.MONGO_SRV, {
            // useMongoClient: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500, // Reconnect every 500ms
            keepAlive: true
        });
        console.log('Connection has been established successfully.');

        const dbModel = ['test', 'user', 'post', 'project', 'subscribe'] // db name goes here
 
        for (let model of dbModel) {
            // require('../controller/' + model + '/model')
            require('../models/' + model)
            
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}