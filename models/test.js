const mongoose = require('mongoose');

const test = mongoose.model('test', function () {
    var s = new mongoose.Schema({
        test: {
            type: String
        },

    }, {
        timestamps: true
    });

    s.statics.create = function (data, callback) {
        new test(data).save(function (err, response_data) {
            if (err) {
                callback(err)
            }
            if (!err) {
                callback(response_data);
            }
        })
    };

    s.statics.fetchAll = function (query, callback) {
        test.find().exec(callback)
    };



    return s
}());
global.models['test'] = test;