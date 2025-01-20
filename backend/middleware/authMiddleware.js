const jwt = require('jsonwebtoken');
const User= require('../models/user');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


exports.authenticate = (req,res,next)=>
{
    if(req.headers)
    {
        const token = req.headers.token;
        if(!token)
        {
            return res.status(401).json({message:"Unauthorized"})
        }
        jwt.verify(token ,JWT_SECRET_KEY,(err,user)=>{
        if(err)
        {
            return res.status(401).json({message:"Unauthorized"})
        }
           req.user_email = req.headers.email;
        //    console.log(req.user_email);
           next();
    })
    }
    else{
        res.status(403).json({message:'User not Logged In'})
    }
}

exports.authorize = (requiredRole)=>async (req,res,next)=>
{
    const user_email=req.user_email;
    
    const user =await User.findOne({email:user_email});
    if(!user)
    {
        return res.status(401).json({message:"Unauthorized"});
    }
    // console.log(user.role);
    // console.log(requiredRole);
    if(user.role !== requiredRole)
    {
        return res.status(403).json({message:'Forbidden'})
    }
    next();
}
