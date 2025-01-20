const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  statement: {
    type: String,
    required: true
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  questionId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Question',
    required: true
    },
    
  comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
  
  approved:{
    type: Boolean,
    required: true,
    default: false
  },

  likes:{
    type:Number,
    default:0
  }

}, { timestamps: true }); 

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
