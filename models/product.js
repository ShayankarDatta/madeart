const mongoose = require('mongoose');

const product = mongoose.model('product', function () {
    var products = new mongoose.Schema({
        
        product:{
            type: String
        },
        productImage:{
            type: String
        },
        description:{
            type: String
        },
        tag:{
            type: Number
        },
        subTag:{
            type: Number
        },
        price: {
            type: Number
        },
        off:{
            type: Number
        },
        originalPrice:{
            type: Number
        },
        createdBy: {
            type: String
        },
        available:{
            type: Number
        },

    }, {
        timestamps: true
    });

    products.statics.create = function (data, callback) {
        new user(data).save(function (err, response_data) {
            if (err) {
                callback(err)
            }
            if (!err) {
                callback(response_data);
            }
        })
    };

    products.statics.fetchAll = function (query, callback) {
        user.find().exec(callback)
    };



    return products
}());
global.models['product'] = product;