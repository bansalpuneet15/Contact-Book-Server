const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {

    const token = req.header('x-auth-token');
    //if Token Not exists return No Token
    if(!token){
        return res.status(401).json({msg : 'No Token Authentication Denied'});
    }
    
    try {
        const decode = jwt.verify(token,config.get('jwtSecret'));
        req.user = decode.user;
        next();
    } catch (error) {
        // error mean not verifyed Token Invalid
        console.error(error.message);
        return res.status(401).json({msg : "Token Invalid"})
    }

}