const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');   //for hashing password
const userSchema = new Schema({
  name:{
    type : String,
    required: true
  },
  
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase : true
  },
  
  password: {
    type: String,
    required: true
  },

  role:{
    type:String,
    required: true,
    enum : ['user','admin'],
    default: 'user'
  },

  activated:{
    type:Boolean,
    default:false,
  }

}, { timestamps: true });   //timestamp : created & updated time s

userSchema.pre('save', async function(next){  ///for register
    if(!this.isModified('password')){
        next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }catch(error){
        next(error)
    }
})

// userSchema.methods.checkPassword = function(password , done){    //for login
//     bcrypt.compare(password, this.password, (err, isMatch)=>{
//         done(err,isMatch);
//     })
// }
userSchema.methods.checkPassword = async function (password) {
  try {
      return await bcrypt.compare(password, this.password);
  } catch (err) {
      throw err;
  }
}

const User = mongoose.model('User', userSchema);



module.exports = User;
