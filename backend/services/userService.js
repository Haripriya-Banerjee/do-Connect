const User = require('../models/user');

exports.getAllUsers = async ()=>{
    const users = await User.find().select({password: 0});  //don't show the password
    return users;
}

exports.getAllEmailsByRole = async (role)=>{
    const users = await User.find({role:role, activated:true}).select({_id:0, email:1});  //don't show the password
    const emails = users.map(user => user.email);
    return emails;
}

exports.getUserById = async (id)=>{
    const user = await User.findById(id, {password:0});  //don't show the password
    return user;
}

exports.getUserByEmailId = async (emailId) => {
    const user = await User.findOne({email:emailId}, {password:0});  //don't show the password
    return user;
}

exports.updateUserById = async (id,data)=>{
    const user = await User.findByIdAndUpdate(id,data,{new:true});  //don't show the password
    return user;
}