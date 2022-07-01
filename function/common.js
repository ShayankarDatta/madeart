const jwt = require('jsonwebtoken');
const config = require('../config');
const models = global.models;

const generateJwtToken = (data) => {
    try {
        // return jwt.sign(data, config.JWT_PRIVATE_KEY,  {expiresIn: "2m" });
        return jwt.sign({data}, config.JWT_PRIVATE_KEY, {expiresIn: '2h'});
    } catch (e) {
        console.log('Token generate err : ', e)
    }
}


const jwtVerify = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_PRIVATE_KEY, (err, decode) => {
            if (err) {
                reject(err)
            }
            resolve(decode)
        })
    });
}

// const jwtVerify =  async (req, res, next) => {
//     try{
//     const token =req.headers['x-auth-token'];
//   if (!token) {
//       return res.status(403).send("A token is required for authentication");
//     }
    
//       const check = jwt.verify(token, config.JWT_PRIVATE_KEY);

//       console.log("data", check);
//       console.log("data", check.data);
      
//     req.user = check;

//       console.log("req", user);

//       next();
//       //console.log(check);
    
//   }
//      catch(err){
//       switch (err.name) {
//           case 'TokenExpiredError':
//               res.status(401).send(errorResponse("Token Expired"));
//               break;
//           case 'JsonWebTokenError':
//               res.status(401).send(errorResponse("Invalid Token!"));
//               break;
//           // case ''
//           default: 
//               res.status(401).send(errorResponse("Unable to Process Token"));
//               break;
//       };
//   }
// }

// function errorResponse(errors) {
// 	return { 
// 		success : false, 
// 		errors: typeof(errors) == 'string' ? [{message : errors}]: errors
// 	}
// }

module.exports = {
    generateJwtToken,
    jwtVerify
}