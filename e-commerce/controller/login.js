const User = require("../model/user");
const { setUser } = require("../services/secret");
const bcrypt = require('bcrypt');

async function handleUserlogin(req,res) {
    const {email, password} = req.body;
    if (!email || !password)
    {
       return res.status(400).json({ message: "Email and Password are required" });
    }
    const foundUser = await User.findOne({ email: email });
    if(!foundUser)
    {
        return res.status(400).json('Invalid Username or Password')
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match)
    {
        const token = setUser(foundUser);
        return res.status(200).json({ message: "User logged in", token , foundUser });
    } else {
        return res.status(400).json('Invalid Username or Password')
    }
}

module.exports = {
    handleUserlogin,
}