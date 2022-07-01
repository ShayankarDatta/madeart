const mongoose = require('mongoose');

const user = mongoose.model('user', function () {
    var users = new mongoose.Schema({
        firstName:{
            type: String,
        },
        lastName:{
            type: String,
        },
        profilePicture:{
            type: String,
        },
        email: {
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        phone:{
            type: String,
        },
        validation: {
            type: Boolean,
            default: false
        },
        userType: {
            type: Number,
            default: 3 //1->admin, 2->seller, 3-> user
        },
        country: {
            type: String,
        },
        state: {
            type: String,
        },
        district:{
            type: String,
        },
        cityOrVillage:{
            type: String,
        },
        postOffice:{
            type: String,
        },
        addressWithNearByLocation:{
            type: String,
        },
        pinCode: {
            type: String,
        },
        otp: {
            type: Number,
        },
        resetpassword: {
            type: false,
        }

    }, {
        timestamps: true
    });

    users.statics.create = function (data, callback) {
        new user(data).save(function (err, response_data) {
            if (err) {
                callback(err)
            }
            if (!err) {
                callback(response_data);
            }
        })
    };

    users.statics.fetchAll = function (query, callback) {
        user.find().exec(callback)
    };



    return users
}());
global.models['user'] = user;