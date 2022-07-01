const mongoose = require('mongoose');

const subscribe = mongoose.model('subscribe', function () {
    var subscribes = new mongoose.Schema({
        userId: {
            type: String,
            required: true,
        },
        transactionAmount: {
            type: String,
            required: true,
        },
        platform: {
            type: String,
            required: true,

        },
        planId:{
            type: String,
        }

    }, {
        timestamps: true
    });

    subscribes.statics.create = function (data, callback) {
        new subscribe(data).save(function (err, response_data) {
            if (err) {
                callback(err)
            }
            if (!err) {
                callback(response_data);
            }
        })
    };

    subscribes.statics.fetchAll = function (query, callback) {
        subscribe.find().exec(callback)
    };



    return subscribes
}());
global.models['subscribe'] = subscribe;