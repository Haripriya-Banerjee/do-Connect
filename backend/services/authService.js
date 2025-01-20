const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.register = async (name, email, password, role = 'user')=>{
    const existingUser = await User.findOne({email});
    if (existingUser){
        throw new Error('User already exists');

    }
    let activated = false;
    if(role==='admin') {
        activated = true; 
    }
    const newUser = new User ({name, email,password,role,activated});
    await newUser.save();
    return 'User registered successfully';
}

exports.login = async (email, password, role = 'user') => {
    try {
        const user = await User.findOne({ email: email, role: role });
        if (!user) {
            throw new Error('Invalid email');
        }
        const isMatch = await user.checkPassword(password);
        if (!isMatch) {
            throw new Error('Invalid password');
        }
        if(user.activated===false) {
            throw new Error('Your account is not active yet!')
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: 60 * 60 * 4 });
        return token;
    } catch (err) {
      throw err;
    }
}


exports.logout = (req) => {
    req.session.destroy();
}
