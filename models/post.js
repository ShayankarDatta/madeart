const mongoose = require('mongoose');

const post = mongoose.model('post', function () {
    var posts = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            unique: true
        },
        content: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,ref:'user',
            required: true

        },

    }, {
        timestamps: true
    });

    posts.statics.create = function (data, callback) {
        new post(data).save(function (err, response_data) {
            if (err) {
                callback(err)
            }
            if (!err) {
                callback(response_data);
            }
        })
    };

    posts.statics.fetchAll = function (query, callback) {
        post.find().exec(callback)
    };



    return posts
}());
global.models['post'] = post;