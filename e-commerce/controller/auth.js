const User = require("../model/user");
const { setUser } = require("../services/secret");
const bcrypt = require('bcrypt');

async function handleUserlogin(req,res) {
    try {
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
        const userData = {
            _id: foundUser._id,
            firstname: foundUser.firstname,
            lastname: foundUser.lastname,
            email: foundUser.email,
            gender: foundUser.gender,
            contact: foundUser.contact,
            address: foundUser.address,
            role: foundUser.role,
            picture: foundUser.picture
          };
          return res.status(200).json({ message: "User logged in", token, foundUser: userData });
      } else {
        return res.status(400).json('Invalid Username or Password')
      }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error during login" });
    }
}


async function handleUserSignup(req,res) {
   try {
    const {firstname, lastname, email, password, gender, contact, address} = req.body;
    const hashpass = await bcrypt.hash(password,10);
    const userData = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashpass,
      gender: gender,
      contact: contact,
      address: address
    };
    if (req.file) {
        userData.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
    }

    const newUser = await User.create(userData);
    const token = setUser(newUser);
    const userResponse = {
      _id: newUser._id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      gender: newUser.gender,
      contact: newUser.contact,
      address: newUser.address,
      role: newUser.role,
      picture: newUser.picture
    };
    return res.status(201).json({ 
      message: 'registered successfully', 
      token, 
      foundUser: userResponse 
    });
    } 
    catch (error) {
      console.error("Signup error:", error);
      res.status(400).json('not registered');
    }
}

async function handleForgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(404).json({ message: "Email not found in our database" });
    }

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error during the email verification" });
  }
}

async function handleResetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(404).json({ message: "Email not found in our database" });
    }

    const hashpass = await bcrypt.hash(newPassword, 10);
    
    await User.findByIdAndUpdate(foundUser._id, { password: hashpass });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error during password reset" });
  }
}

module.exports = {
  handleUserlogin,
  handleUserSignup,
  handleForgotPassword,
  handleResetPassword,
}