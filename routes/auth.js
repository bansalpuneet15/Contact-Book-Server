const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const {check , validationResult} = require('express-validator');

const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../model/User');

const auth = require('../Middleware/auth')

router.get('/',auth,async(req,res)=>{
    try {
        // Checking userId in mongoDB
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Server Error");
    }
})

router.post('/',[
    check('email','Please Enter Valid Email ID').isEmail(),
    check('password','Please Enter Password').exists()
],async (req,res)=>{
    console.log("LOgin");
    // chekc if any validation error occur
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg : errors.array()});
    }

    const { email , password } = req.body;

    try {
        const user = await User.findOne({email});
        // if a user exists in DB then go further if Not return Invalid Crend..
        if(!user){
            return res.status(400).json({msg : "Invalid Credentials"});
        }
        // if user exists then we check password Match or Not Using bcrypt
        const isMatch = await bcrypt.compare(password , user.password);
        // if pwd not match return Invalid Crend..
        if(!isMatch){
            return res.status(400).json({msg : "Invalid Credentials"});
        }

        // Token prepration for response with Data
        const payload = {
            user : {
                id : user.id
            }
        }
        // return Token
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn : 360000}, (err,token) =>{
            if(err) throw err;
            res.status(200).json({token});
        })

    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
}
)

module.exports = router;
