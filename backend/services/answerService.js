const Answer = require('../models/answer')
const User = require('../models/user')
const Question = require('../models/question')
const Comment = require('../models/comment')

exports.getAllAnswers = async (questionId)=>{
    const question = await Question.findById(questionId);
    if(!question || question.approved===false){
        throw new Error('Either question is not found or not approved')
    }
    const answers = await Answer.find({questionId}).populate('userId', 'name').populate('questionId').populate('comments');  //also show comments data and only name from user schema
    return answers;
}

exports.getAnswerById = async (id)=>{
    const answer = await Answer.findById(id);
    return answer;
}

exports.createAnswer = async (data, questionId, email)=>{
    const user = await User.findOne({email:email});
    if(!user || user.activated===false){  //user should be activated to write a question
        throw new Error ('User with given id not activated')
    }
    const userId = user._id;
    data.userId = userId;

    const question = await Question.findById(questionId);

    if(!question){ //Question should be present to write an answer
        throw new Error ('Question with given id is not available');
    }

    if(question.approved===false) { //Question should be approved to write an answer
        throw new Error ('Question with given id is not approved');
    }

    if(question.isActive===false) { //Question should not be resolved to write an answer
        throw new Error ('Question with given id is resolved');
    }
    
    data.questionId = questionId;

    const answer = new Answer(data);
    const newAnswer= await (await answer.save()).populate('questionId');
    console.log('new answer'+newAnswer);
    question.answers.push(newAnswer._id);
    console.log('question'+question);
    const newQuestion = await question.save();
    console.log('new question'+newQuestion);
    return newAnswer;
}
exports.updateAnswer = async (id,data,email,role)=>{
    if(role!=='admin') {  //admin can update any answer
        const user= await User.findOne({email});
        if(!user || user.activated===false){
            throw new Error('User with given id is not activated')
        }
        const userId = user._id;
        const answer = await Answer.findById(id);
        if(!userId.equals(answer.userId)){  //check if logged in user is the writer
            throw new Error('User id does not match')
        }
        const question = await Question.findById(answer.questionId);
        if(!question) { //Question should be present to update an answer
            throw new Error('Question is not available');
        }
        if(question.approved===false) {  //Question should be approved to update an answer
            throw new Error('Question is not approved');
        }

        if(question.isActive===false) { //Question should not be resolved to update an answer
            throw new Error ('Question with given id is resolved');
        }
    }
    const updatedAnswer = await Answer.findByIdAndUpdate(id,data,{new:true}).populate('userId', 'name').populate('questionId').populate('comments');
    return updatedAnswer;
}
exports.likeAnswer = async(id)=>{
    const answer = await Answer.findById(id);
    if(!answer){
        throw new Error('Cannot find answer')
    }
    if(answer.approved===false){
        throw new Error('Answer is not approved');
    }
    const data={likes:answer.likes+1};  //for update the like 
    const updatedAnswer = await Answer.findByIdAndUpdate(id,data,{new:true}).populate('userId', 'name').populate('questionId').populate('comments');
    return updatedAnswer;
}

exports.dislikeAnswer = async(id)=>{
    const answer = await Answer.findById(id);
    if(!answer){
        throw new Error('Cannot find answer')
    }
    if(answer.approved===false){
        throw new Error('Answer is not approved');
    }
    
    let likesCount = answer.likes>0?(answer.likes-1):0
  
    const data={likes:likesCount};  //for update the dislike 

    const updatedAnswer = await Answer.findByIdAndUpdate(id,data,{new:true}).populate('userId', 'name').populate('questionId').populate('comments');
    return updatedAnswer;
}

exports.deleteAnswer = async(id, email)=>{
    const user= await User.findOne({email});
    if(!user || user.activated===false){
        throw new Error('User with given id is not activated')
    }
    const userId = user._id;
    const answer = await Answer.findById(id);
    if(!userId.equals(answer.userId)){  //check if logged in user is the writer
        throw new Error('User id does not match')
    }
    answer.comments.forEach(async(commentId) => {
        await Comment.findByIdAndDelete(commentId);  //deleting all the comments of the answer
    })

    const deletedAnswer = await Answer.findByIdAndDelete(id);
    const questionId = deletedAnswer.questionId;
    let question = await Question.findById(questionId);
    const answers = question.answers.filter(ansId=>!ansId.equals(deletedAnswer._id))
    question.answers = answers;
    const newQuestion = await question.save();
    return deletedAnswer;
}