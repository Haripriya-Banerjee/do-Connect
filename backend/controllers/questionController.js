const questionService = require('../services/questionService');
const userService = require('../services/userService');
const { sendEmail } = require('../emailSender/emailService');

exports.getAllQuestions = async(req,res)=>{
    try{
        const statement = req.query.statement;
        const questions = await questionService.getAllQuestions(statement.trim());  //trim: remove space from start & end
        res.json(questions);
    }catch(err){
        res.status(500).json({message:"Failed to fetch questions...",error:err.message})
    }
}

exports.getQuestionById = async(req,res)=>{
    try{
        const id = req.params.id ;
        const question = await questionService.getQuestionById(id);
        if(!question){
            return res.status(404).json({message:"Question not found"});
        }
        res.json(question);

    }catch(err){
        res.status(500).json({message:"Failed to fetch question",error:err.message})
    }
}

exports.createQuestion = async(req,res)=>{
    try{
        const data = req.body;
        if(!data.statement){
            return res.status(400).json({message:"Statement is required"})
        }
        const email = req.headers.email;
        const question = await questionService.createQuestion(data,email);
        const toEmails = await userService.getAllEmailsByRole('admin');
        await sendEmail(toEmails, 'New question added', `The new question is: '${question.statement}'`)
        res.status(201).send(question);
    }catch(err){
        res.status(500).json({message:"Failed to create question",error:err.message})
    }
}

exports.updateQuestionStatement = async(req,res)=>{    
    try{
        const id = req.params.id;
        const statement = req.body.statement;
        const email = req.headers.email;
        const role = req.headers.role;
        if(!statement){
            return res.status(400).json({message:"statement is required"});
        }
        const question = await questionService.updateQuestion(id,{statement},email,role);
        res.json(question);
    
    }catch(err){
        res.status(500).json({message:"Failed to update question",error:err.message})
    }
}

exports.updateStatusFields = async(req,res)=>{
    try{
        const id = req.params.id;
        const data = req.body;
        const email = req.headers.email;
        const role = req.headers.role;
        if(!data){
            return res.status(400).json({message:"Question data is required"});
        }
        if(data.isActive===null && data.approved===null) {  //isActive===false is for resolved question, approved is updated by admin 
            return res.status(400).json({message: "is active or approved fields are required"})
        }
        const question = await questionService.updateQuestion(id,{isActive: data.isActive, approved: data.approved}, 
            email, role);
        res.json(question)
    }catch(err){
        res.status(500).json({message:"Failed to update question",error:err.message})
    }
}

exports.deleteQuestion = async(req,res)=>{
    try{
        const id = req.params.id;
        const email = req.headers.email;
        const question = await questionService.deleteQuestion(id, email);
        if(!question){
            return res.status(404).json({message:"Question not found"});
        }
        res.json({message:"Question deleted successfully"})
    }catch(err){
        res.status(500).json({message:"Failed to delete question",error:err.message})
    }
}
