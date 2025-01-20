const answerService = require('../services/answerService');
const userService = require('../services/userService');
const { sendEmail } = require('../emailSender/emailService');

exports.getAllAnswers = async(req,res)=>{
    try{
        const questionId = req.params.questionId;
        const answers = await answerService.getAllAnswers(questionId);
        res.json(answers);
    }catch(err){
        res.status(500).json({message:"Failed to fetch answers...",error:err.message})
    }
}

exports.getAnswerById = async(req,res)=>{
    try{
        const id = req.params.id ;
        const answer = await answerService.getAnswerById(id);
        if(!answer){
            return res.status(404).json({message:"Answer not found"});
        }
        res.json(answer);

    }catch(err){
        res.status(500).json({message:"Failed to fetch answer",error:err.message})
    }
}

exports.createAnswer = async(req,res)=>{
    try{
        const questionId = req.params.questionId;
        const email = req.headers.email;
        const statement = req.body.statement;
        if(!statement){
            return res.status(400).json({message:"Statement is required"})
        }
        const answer = await answerService.createAnswer({statement}, questionId, email);
        const toEmails = await userService.getAllEmailsByRole('admin');
        await sendEmail(toEmails, 'New answer added', 
        `A new answer added to the question '${answer.questionId.statement}'
        The answer is: '${answer.statement}'`);
        res.status(201).send(answer);
    }catch(err){
        res.status(500).json({message:"Failed to create answer",error:err.message})
    }
}

exports.updateAnswer = async(req,res)=>{
    try{
        const id = req.params.id;
        const statement = req.body.statement;
        const email = req.headers.email;
        const role = req.headers.role;
        if(!statement){
            return res.status(400).json({message:"statement is required"});
        }
        const answer = await answerService.updateAnswer(id,{statement},email,role);
        res.json(answer);
    
    }catch(err){
        res.status(500).json({message:"Failed to update answer",error:err.message})
    }
}
exports.likeAnswer = async(req,res)=>{
    try{
        const id = req.params.id;
        const answer = await answerService.likeAnswer(id);
        res.json(answer);
    
    }catch(err){
        res.status(500).json({message:"Failed to update answer",error:err.message})
    }
}

exports.dislikeAnswer = async(req,res)=>{
    try{
        const id = req.params.id;
        const answer = await answerService.dislikeAnswer(id);
        res.json(answer);
    
    }catch(err){
        res.status(500).json({message:"Failed to update answer",error:err.message})
    }
}

exports.aproveAnswer = async(req,res)=>{
    try{
        const id = req.params.id;
        const data = req.body;
        const email = req.headers.email;
        const role = req.headers.role;
        if(!data){
            return res.status(400).json({message:"Answer data is required"});
        }
        if(data.approved===null) {
            return res.status(400).json({message: "approved field is required"})
        }
        const answer = await answerService.updateAnswer(id,{approved: data.approved},email,role);
        res.json(answer);
    }catch(err){
        res.status(500).json({message:"Failed to update answer",error:err.message})
    }
}

exports.deleteAnswer = async(req,res)=>{
    try{
        const id = req.params.id;
        const email = req.headers.email;
        const answer =await answerService.deleteAnswer(id, email);
        if(!answer){
            return res.status(404).json({message:"answer not found"});
        }
        res.json({message:"answer deleted successfully"})
    }catch(err){
        res.status(500).json({message:"Failed to delete answer",error:err.message})
    }
}
