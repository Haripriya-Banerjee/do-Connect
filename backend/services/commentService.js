const Comment = require('../models/comment')
const User = require('../models/user')
const Answer = require('../models/answer')
const Question = require('../models/question')

exports.getAllComments = async (answerId)=>{
    const answer = await Answer.findById(answerId);
    if(!answer || answer.approved===false){
        throw new Error('Either answer is not found or not approved')
    }
    const comments = await Comment.find({answerId}).populate('userId', 'name');  //only show the name of the writer from user schema
    return comments;
}

exports.getCommentById = async (id)=>{
    const comment = await Comment.findById(id);
    return comment;
}

exports.createComment = async (data, answerId, email)=>{
    const user = await User.findOne({email:email});
    if(!user || user.activated===false){  //check if writer is active
        throw new Error ('User with given id not activated')
    }
    const userId = user._id;
    data.userId = userId;

    const answer = await Answer.findById(answerId);

    if(!answer || answer.approved===false){  //check if answer is present or approved
        throw new Error ('Answer with given id is not approved')
    }

    const question = await Question.findById(answer.questionId);

    if(!question){  //Question should be present to write a comment
        throw new Error ('Question with given id is not available');
    }

    if(question.approved===false) {  //Question should be approved to write a comment
        throw new Error ('Question is not approved');
    }

    if(question.isActive===false) {  //Question should not be resolved to write a comment
        throw new Error ('Question is resolved');
    }

    data.answerId = answerId;

    const comment = new Comment(data);
    const newComment= await comment.save();
    answer.comments.push(newComment._id);
    const newAnswer = await answer.save();
    return newComment;
}

exports.updateComment = async (id,data,email)=>{
    const user = await User.findOne({email});
    if(!user || user.activated===false){  //check if writer is active
        throw new Error('User is not activated');
    }
    const userId = user._id;
    const comment = await Comment.findById(id);

    if(!userId.equals(comment.userId)) {  //check if logged in user is the writer, only then he/she can update comment
        throw new Error('User id does not match');
    }

    const answer = await Answer.findById(comment.answerId);
    if(!answer || answer.approved===false){
        throw new Error ('Answer is not present or not approved')
    }

    const question = await Question.findById(answer.questionId);
    if(!question){  //Question should be present to update a comment
        throw new Error ('Question is not available');
    }

    if(question.approved===false) {  //Question should be approved to update a comment
        throw new Error ('Question is not approved');
    }

    if(question.isActive===false) {  //Question should not be resolved to write a comment
        throw new Error ('Question is resolved');
    }

    const updatedComment = await Comment.findByIdAndUpdate(id,data,{new:true});
    return updatedComment;
}

exports.likeComment= async(id)=>{
    const comment = await Comment.findById(id);
    if(!comment){
        throw new Error('Comment can not find');
    }
    const data={likes:comment.likes+1};  //for update the like 
    const updatedComment = await Comment.findByIdAndUpdate(id,data,{new:true}).populate('userId', 'name');
    return updatedComment;
}

exports.dislikeComment= async(id)=>{
    const comment = await Comment.findById(id);
    if(!comment){
        throw new Error('Comment can not find');
    }
    let likesCount = comment.likes>0?comment.likes-1:0;
    const data={likes:likesCount};  //for update the like 
    const updatedComment = await Comment.findByIdAndUpdate(id,data,{new:true}).populate('userId', 'name');
    return updatedComment;
}

exports.deleteComment = async(id, email)=>{
    const user= await User.findOne({email});
    if(!user || user.activated===false){  //check if writer is active
        throw new Error('User with given id is not activated')
    }
    const userId = user._id;
    const comment = await Comment.findById(id);
    if(!userId.equals(comment.userId)){  //check if logged in user is the writer, only then he/she can delete comment
        throw new Error('User id does not match')
    }
    const deletedComment = await Comment.findByIdAndDelete(id);
    const answerId = deletedComment.answerId;
    let answer = await Answer.findById(answerId);
    answer.comments = answer.comments.filter(comId=>!comId.equals(deletedComment._id));
    const newAnswer = await answer.save();
    return deletedComment;
}