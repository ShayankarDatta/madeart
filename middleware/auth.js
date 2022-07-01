const jwt = require('jsonwebtoken');
const { success, error401 } = require('../function/response')
const { jwtVerify } = require('../function/common')
const config = require('../config.json')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const models = global.models;
const mongoose = require('mongoose');



// exports.apiAuth = async (req,res,next) => {
//     const header = req.header('x-access-token');

//     // console.log('api access client key : ',bcrypt.hashSync(config.API_SECRET_KEY, salt));

//     if(!header) {
//         error401(res)
//         return false
//     }
    
//     let compare = false
//     try {
//         compare = await bcrypt.compareSync(config.API_SECRET_KEY, header)
//     } catch (e) {
//         error401(res)
//         return false
//     }

//     if(!compare) {
//         error401(res)
//         return false 
//     }
//     else {
//         next()
//     }
// }


exports.apiAuth = async (req,res,next) => {
    const header = req.header('x-access-token');

    if(!header) {
        error401(res)
        return false
    }
    
    let compare;
    try {
        compare = jwt.verify(header, config.JWT_PRIVATE_KEY);
        // console.log("Comp", compare);
 
    } catch (e) {
        error401(res)
        return false
    }

    if(!compare) {
        error401(res, "Provided x-access-token is not valid")
        
        return false 
    }
    else {
        let user;
        try{
           user = await models.user.findOne({ _id: mongoose.Types.ObjectId(compare.data)});
            // console.log(user);
        }
        catch (e) {
            error401(res)
            return false
        }
        if(user){
            next();    
        }
        
    }
}