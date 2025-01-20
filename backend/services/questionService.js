const Question = require('../models/question')
const User = require('../models/user')
const Answer = require('../models/answer')
const Comment = require('../models/comment')

exports.getAllQuestions = async (statement)=>{
    const questions = await Question.find({"statement": {$regex: statement, $options: 'i'}});
    return questions;
}

exports.getQuestionById = async (id)=>{
    const question = await Question.findById(id).populate('userId','name').populate('answers'); 
    // it will come all the users name & id(autometically) and all the answer
    return question;
}

exports.createQuestion = async (data,email)=>{
    const user = await User.findOne({email:email});
    if(!user || user.activated===false){  //only active users can write a question
        throw new Error ('User with given id not activated')
    }
    const userId = user._id;
    data.userId=userId;
    const question = new Question(data);
    const newQuestion= await question.save();
    return newQuestion;
}

exports.updateQuestion = async (id,data,email,role)=>{
    if(role!=='admin') {
        const user= await User.findOne({email});
        if(!user || user.activated===false){  //only active users can write a question
            throw new Error('User with given id is not activated')
        }
        const userId = user._id;
        const question = await Question.findById(id);
        if(!userId.equals(question.userId)){  //User Id of the logged in user should match with question writer if logged in role is user for deleting it
            throw new Error('User id does not match')
        }
    }
    const updatedQuestion = await Question.findByIdAndUpdate(id,data,{new:true});
    return updatedQuestion;
}

exports.deleteQuestion = async(id, email)=>{
    const user= await User.findOne({email});
    if(!user || user.activated===false){  //only active users can write a question
        throw new Error('User with given id is not activated')
    }
    const userId = user._id;
    const question = await Question.findById(id);
    if(!userId.equals(question.userId)){  //User Id of the logged in user should match with question writer for deleting it
        throw new Error('User id does not match')
    }
    question.answers.forEach(async (answerId) => {  
        let answer = await Answer.findById(answerId);  //fetching each answer of the question
        answer.comments.forEach(async (commentId) => {
            await Comment.findByIdAndDelete(commentId);  //deleting each comment of the fetched answer
        })
        await Answer.findByIdAndDelete(answerId);  //deleting each answer
    });
    const deletedQuestion = await Question.findByIdAndDelete(id);
    return deletedQuestion;
}