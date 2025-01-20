const authService = require('../services/authService')

exports.register = async (req,res)=>{
  const {name,email, password,role}=req.body;
  try{
    const message = await authService.register(name, email, password, role);
    res.status(201).json({message});
  }catch(error){
    res.status(500).json({message:error.message});
  }
}

exports.login = async(req,res)=>{
  const {email, password,role}=req.body;
  try{
    
    const token = await authService.login(email, password, role);
  
    req.session.authorization = {
      token,  //saving the jwt token email & role
      email,
      role
    }
    res.status(200).json({message:'User logged in Successfully', token});
  }catch(error){
    res.status(500).json({message:error.message});
  }
}


exports.logout = (req,res)=>{
  try{
    authService.logout(req);
    res.status(200).json({message:'Logged Out Successfully'});

  }catch(error){
    res.status(500).json({message:error.message});
  }
}



// exports.login = async (email, password, role = 'user') => {
//   try {
//       const user = await User.findOne({ email: email, role: role });
//       if (!user) {
//           throw new Error('Invalid email');
//       }
//       const isMatch = await user.checkPassword(password);
//       if (!isMatch) {
//           throw new Error('Invalid password');
//       }
//       const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: 60 * 60 });
//       return token;
//   } catch (err) {
//       throw err;
//   }
// }

// userSchema.methods.checkPassword = async function (password) {
//   try {
//       return await bcrypt.compare(password, this.password);
//   } catch (err) {
//       throw err;
//   }
// }
