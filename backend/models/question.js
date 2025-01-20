const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  statement: {
    type: String,
    required: true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Answer'
    }
  ],
  
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },

  approved:{
    type: Boolean,
    required: true,
    default: false
  },

}, { timestamps: true }); 

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
