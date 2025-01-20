const userService = require('../services/userService');

exports.getAllUsers = async(req, res) => {  //we got all users data 
    
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    }
    catch(err) {
        res.status(500).json({message:"Failed to fetch users",error:err.message});
    }
}

exports.getUserById = async(req, res) => {    //userid aftr authorization 
    try {
        const id = req.params.id;
        const user = await userService.getUserById(id);
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    }
    catch(err) {
        res.status(500).json({message:"Failed to fetch user",error:err.message, req:req});
    }
}

exports.getUserByEmailId = async(req, res) => {  //get user id by email
    try{
        console.log(req);
        const emailId = req.params.emailId;
        const user = await userService.getUserByEmailId(emailId);
        res.json(user);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message:"Failed to fetch user",error:err.message});
    }
}

exports.updateUserById = async(req, res) => {  //only for update the status..only admin can show
    try {
        const id = req.params.id;
        const activated = req.body.activated;
        if(activated===null) {
            return res.status(400).json({message: "Failed to update user"});
        }
        const user = await userService.updateUserById(id, {activated});
        res.json(user);
    }
    catch(err) {
        res.status(500).json({message:"Failed to update user",error:err.message});
    }
}
