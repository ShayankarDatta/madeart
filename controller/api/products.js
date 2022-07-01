const express = require('express')
const router = express.Router()
const models = global.models;
const mongoose = require('mongoose');
const { apiAuth } = require('../../middleware/auth')
const { success, error401 } = require('../../function/response')
const { generateJwtToken } = require('../../function/common')
const config = require('../../config')
const { Validator } = require('node-input-validator');

const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

exports.productAdd = async (req, res) => {

    const v = new Validator(req.body, {
        email: 'required|string',
        password: 'required|string',   
    });

    const matched = await v.check();

    if (!matched) {
        error422(res, 'Validation Error', v.errors)
        return false
    }

    let emailExists;
    let phoneExist;
    try{
        if(req.body.email){
            let mailCheck = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
            // console.log(mailCheck.test(String(req.body.email)));
            if (!mailCheck.test(String(req.body.email))){

                error401(res, 'enter a valid email');
                    // return res.status(400).send({
                    //     status: 'fail',
                    //     message: 'enter a valid email'
                    // })
                }

                req.body.email = req.body.email.toLowerCase();

                emailExists = await models.user.findOne({ email: req.body.email });
            }
            if(req.body.phone){
                phoneExist = await models.user.findOne({ email: req.body.phone });
            }
        }
        catch (e) {
            console.log(e)
        }        
        // console.log(emailExists);
        if(emailExists || phoneExist){
            return error401(res, 'This user is already registered', req.body.email, req.body.phone);
        }
        
    
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

        if (!passwordRegex.test(String(req.body.password))){
            
            error401(res, 'enter a valid password with 1 upper case 1 lower case 1 numeric and 1 special character with minimum 8 character');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, config.PASSWORD.SALT);
            
        try{
            models.user.create({email: req.body.email, phone: req.body.phone, password: hashedPassword}, ( data ) => {
                success(res, 'Create User Profile', data)
            })

            // function getRndInteger(min, max) {
            //     return Math.floor(Math.random() * (max - min)) + min;
            // }
            // let otp = getRndInteger(1000, 9999);
            // console.log(otp)
            if(req.body.email){
                var mailOptions = {
                    from: "madeart<noreply>@madeart.com",
                    to: req.body.email,
                    subject: 'Welcome to Made Art',
                    text: 'welcome to made art'
                    // html: require('./welcomeMail')
                };
            
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }
        catch (e) {
            console.log(e)
        }
}

exports.login = async (req, res) => {
    
    const v = new Validator(req.body, {
        username: 'required|string',
        password: 'required|string',   
    });

    const matched = await v.check();

    if (!matched) {
        error422(res, 'Validation Error', v.errors)
        return false
    }

    try {
        const emailExists = await models.user.findOne({ email: req.body.username });
        const phoneExist = await models.user.findOne({phone: req.body.username});
        // const userPhone = await UserModel.findOne({$or: [{phone: req.body.username}, {phone: req.body.cc + req.body.username}]});
    

        const user = emailExists || phoneExist;
        
        if(user){
            const passwordMatch=await bcrypt.compare(req.body.password, user.password);
            // console.log(passwordMatch);

            if(passwordMatch){
                    
                success(res, 'Login Successfully', generateJwtToken(user.id));
                console.log(generateJwtToken(user.id));
            }
            else{
                error401(res, 'The email or password you have entered is wrong!!!');
            }
        }
        else{
            error401(res, 'The email or password you have entered is wrong!!!');
        }   
    }
    catch (e) {
        console.log(e)
    } 
    
}

exports.passwordChange = async (req, res) => {
    
    const v = new Validator(req.body, {
        password: 'required|string',
        newPassword: 'required|string',  
        confirmPassword: 'required|string',   
    });

    const matched = await v.check();

    if (!matched) {
        error422(res, 'Validation Error', v.errors)
        return false
    }
    try{
        const header = req.header('x-access-token');
        const compare = jwt.verify(header, config.JWT_PRIVATE_KEY);
        console.log(compare)
        const userExists = await models.user.findOne({ _id: mongoose.Types.ObjectId(compare.data)});
        if(userExists){
            const passwordMatch=await bcrypt.compare(req.body.password, userExists.password);
            if(passwordMatch){
                if(req.body.newPassword==req.body.password){
                    error401(res, 'This new password is same as your current password, please change it!!!');
                }else{
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

                    if (!passwordRegex.test(String(req.body.newPassword))){
                        error401(res, 'enter a valid password with 1 upper case 1 lower case 1 numeric and 1 special character with minimum 8 character');
                    }
                    if(req.body.newPassword==req.body.confirmPassword){

                        const hashedPassword = await bcrypt.hash(req.body.newPassword, config.PASSWORD.SALT);

                        await models.user.updateOne({_id: mongoose.Types.ObjectId(compare.data), password: hashedPassword});
                        
                        success(res, 'Password changed successfully');
                    }else{
                        error401(res, 'New password and confirm password must be same');
                    }
                }

            }else{
                error401(res, 'The password you have entered is wrong');
            }
        }
    }
    catch(e){
        console.log(e)
    }    
}

exports.otpSend = async (req, res) => {
    try {

        const header = req.header('x-access-token');
        const compare = jwt.verify(header, config.JWT_PRIVATE_KEY);
        console.log(compare)
        const userExists = await models.user.findOne({ _id: mongoose.Types.ObjectId(compare.data)});

        if(userExists){
            function getRndInteger(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }

            let otp = getRndInteger(1000, 9999);
            console.log(otp)

            await models.user.updateOne({_id: mongoose.Types.ObjectId(compare.data), otp: otp});

            var mailOptions = {
                from: "madeart<noreply>@madeart.com",
                to: userExists.email,
                subject: 'Otp to validate your account Made Art',
                text: `Enter this ${otp} Otp to validate your account in Made Art`
                    // html: require('./welcomeMail')
            };
            
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            
            success(res, 'otp send to mail');
        }else{
            error401(res, 'Token is not valid');
        }
    }
    
    catch(err){
        console.log(err);
    }

}

exports.otpValid = async (req, res) => {

    const v = new Validator(req.body, {
        otp: 'required|integer',  
    });

    const matched = await v.check();

    if (!matched) {
        error422(res, 'Validation Error', v.errors)
        return false
    }

    try {

        const header = req.header('x-access-token');
        const compare = jwt.verify(header, config.JWT_PRIVATE_KEY);
        console.log(compare)
        const userExists = await models.user.findOne({ _id: mongoose.Types.ObjectId(compare.data)});

        if(userExists){
            
            if(userExists.otp==req.body.otp){
                
                await models.user.updateOne({_id: mongoose.Types.ObjectId(compare.data), otp: 0000, validation: true });
                success(res, 'Account validate successfully');
            }
            else{
                await models.user.updateOne({_id: mongoose.Types.ObjectId(compare.data), otp: 0000 });
                success(res, 'Otp is not matching');
            }

        }else{
            error401(res, 'Token is not valid');
        }
    }
    
    catch(err){
        console.log(err);
    }

}

exports.sendPasswordReset = async (req, res) => {

    const v = new Validator(req.body, {
        email: 'required|string',  
    });

    const matched = await v.check();

    if (!matched) {
        error422(res, 'Validation Error', v.errors)
        return false
    }

    try {

        let mailCheck = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        if (!mailCheck.test(String(req.body.email))){
            error401(res, 'enter a valid email');
        }

        const emailExists = await models.user.findOne({ email: req.body.email });
        
        if(emailExists){

            await models.user.updateOne({_id: mongoose.Types.ObjectId(emailExists._id), passwordReset: true});

            var mailOptions = {
                from: "madeart<noreply>@madeart.com",
                to: req.body.email,
                subject: 'Password reset for Made Art',
                text: 'open this link www.madeart.com/user/resetPassword for reseting your password!'
                // html: require('./welcomeMail')
            };
    
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            success(res, 'Email send to user account');
        }else{
            error401(res, 'This email is not registered');
        }
    }
    
    catch(err){
        console.log(err);
    }

}

exports.passwordReset = async (req, res) => {

    const v = new Validator(req.body, {
        email: 'required|string',  
    });

    const matched = await v.check();

    if (!matched) {
        error422(res, 'Validation Error', v.errors)
        return false
    }

    try {

        let mailCheck = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
        if (!mailCheck.test(String(req.body.email))){
            error401(res, 'enter a valid email');
        }

        const emailExists = await models.user.findOne({ email: req.body.email });
        
        if(emailExists){

            await models.user.updateOne({_id: mongoose.Types.ObjectId(emailExists._id), passwordReset: true});

            var mailOptions = {
                from: "madeart<noreply>@madeart.com",
                to: req.body.email,
                subject: 'Password reset for Made Art',
                text: 'open this link www.madeart.com/user/resetPassword for reseting your password!'
                // html: require('./welcomeMail')
            };
    
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            success(res, 'Email send to user account');
        }else{
            error401(res, 'This email is not registered');
        }
    }
    
    catch(err){
        console.log(err);
    }

}

// exports.inappPurchase = async (req, res) => {
//     var iap = require('in-app-purchase');
// // iap.config({

// //     /* Configurations for HTTP request */
// //     requestDefaults: { /* Please refer to the request module documentation here: https://www.npmjs.com/package/request#requestoptions-callback */ },

// //     /* Configurations for Apple */
// //     appleExcludeOldTransactions: true, // if you want to exclude old transaction, set this to true. Default is false
// //     applePassword: 'abcdefg...', // this comes from iTunes Connect (You need this to valiate subscriptions)


// //     // /* Configurations all platforms */
// //     // test: true, // For Apple and Googl Play to force Sandbox validation only
// //     // verbose: true // Output debug logs to stdout stream
// // });

// var configObject={
//     appleExcludeOldTransactions: true, 
//     applePassword: 'abcdefg...',
// }
// iap.config(configObject);
// iap.setup()
//   .then(() => {
//     iap.validateOnce(receipt, appleSecretString).then(onSuccess).catch(onError);
//   })
//   .catch((error) => {
//     // error...
//   });
// function onSuccess(validatedData) {
//     // validatedData: the actual content of the validated receipt
//     // validatedData also contains the original receipt
//     var options = {
//         ignoreCanceled: true, // Apple ONLY (for now...): purchaseData will NOT contain cancceled items
//         ignoreExpired: true // purchaseData will NOT contain exipired subscription items
//     };
//     // validatedData contains sandbox: true/false for Apple and Amazon
//     var purchaseData = iap.getPurchaseData(validatedData, options);
// }

// function onError(error) {
//     // failed to validate the receipt...
// }

// }