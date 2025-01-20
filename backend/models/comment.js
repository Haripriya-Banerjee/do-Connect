const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  statement: {
    type: String,
    required: true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Answer',
    required: true
    },
  
  likes:{
    type:Number,
    default:0
  }

}, { timestamps: true }); 

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
