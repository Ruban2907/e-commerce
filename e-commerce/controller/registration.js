const User = require("../model/user");
const bcrypt = require('bcrypt');

async function handleUserSignup(req,res) {
   try {
    console.log("am here")
        const {name,email,password} = req.body;
        const hashpass = await bcrypt.hash(password,10);
        await User.create ({
            name: name,
            email: email,
            password: hashpass,
    });
    return res.status(201).json('registered successfully');
   } catch (error) {
        res.status(400).json('not registered');
   }
}

module.exports = {
    handleUserSignup
}