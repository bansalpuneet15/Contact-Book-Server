const express = require('express');
const router = express.Router();

// for protective we USe auth Middleware
const auth = require('../Middleware/auth');
const Contact = require('../model/Contact');
// for Validations
const { check, validationResult } = require('express-validator');

router.get('/',auth,async(req,res)=>{
    try {
        const contacts = await Contact.find({user : req.user.id}).sort({date : -1});
        res.json(contacts);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }
})

router.post('/',[auth,[
    check('name', 'Name is required').not().isEmpty(),
]], async (req,res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    const { name , email , phone , type} = req.body
    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            type,
            user : req.user.id
        })
    
        const contact = await newContact.save();
    
        res.json(contact);
    } catch (error) {
        console.error(error.message);
        return res.send("Server Error");
    }

})

router.put('/:id',[auth,[
    check('name', 'Name is required').not().isEmpty(),
]], async (req,res)=>{
    const id = req.params.id;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    const { name , email , phone , type} = req.body
    try {
        
        const contact = await Contact.updateOne({"_id": `${id}`},{
            name,
            email,
            phone,
            type,
            user : req.user.id
        })
        res.json(contact);
    
    } catch (error) {
        console.error(error.message);
        return res.send("Server Error");
    }

})

router.delete('/:id',auth,async(req,res)=>{
    // console.log()
    const id = req.params.id;
    console.log(id);
    try {
        await Contact.deleteOne({"_id": `${id}`});
        res.send("Deletes");
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Server Error");
    }
    res.send("Contact deleted");
})

module.exports = router;