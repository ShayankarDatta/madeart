const api = require('express').Router();
const { apiAuth } = require('../middleware/auth');
const { registerCheck, loginCheck, postCheck } = require('../middleware/validation');
// const { check } = require("express-validator");
//controllers





const testCont = require('../controller/api/test')
const products = require('../controller/api/products')

// const token =req.headers['x-auth-token'];

module.exports = (app) => {
    app.use('/api', api);

    api.get('/', (req,res) => {
        res.send('Invalid endpoint!')
    })

    api.post('/register', testCont.register); 
    api.post('/login', testCont.login);
    api.post('/passwordChange', apiAuth,testCont.passwordChange);
    api.get('/otpSend', apiAuth,testCont.otpSend);
    api.post('/otpValid', apiAuth, testCont.otpValid);
    api.post('/sendPasswordReset', testCont.sendPasswordReset);
    api.post('/passwordReset', testCont.passwordReset);

    api.post('/productAdd', apiAuth, products.productAdd);
}