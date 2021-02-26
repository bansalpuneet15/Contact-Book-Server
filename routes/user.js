const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// for jsonwebtoken
const jwt = require('jsonwebtoken');
const config = require('config');

// for Validations
const { check, validationResult } = require('express-validator');

const User = require('../model/User')

router.post('/', [
    check('name', 'Please Enter User Name').not().isEmpty(),
    check('email', 'Please Enter Valid Email').isEmail(),
    check('password', 'Please Enter Password Upto 5 length').isLength({ min: 5 })
], async (req, res) => {
    console.log("User Created");
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }

    // Creating a new User
    const {name, email, password} = req.body;
    
    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ msg: "User already Exists" })
        }
        
        // new User Created but not Saved in mongoDB yet
        user = new User({ name, email, password });
        
        // before saving in MongoDB we need to Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        
        // Now Hashing COmplete we can Save the User in MongoDB
        await user.save();
        // res.send('user Saved Successfully');
        
        // Create webToken for users
        const payload = {
            user : {
                id : user.id
            }
        }
        
        jwt.sign(payload,config.get('jwtSecret'), {expiresIn : 360000}, (err,token) =>{
            if(err) throw err;
            
            res.json({token});
        })
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;