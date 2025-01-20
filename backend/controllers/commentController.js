const commentService = require('../services/commentService');

exports.getAllComments = async(req,res)=>{
    try{
        const answerId = req.params.answerId;
        const comments = await commentService.getAllComments(answerId);
        res.json(comments);
    }catch(err){
        res.status(500).json({message:"Failed to fetch comments...",error:err.message})
    }
}

exports.getCommentById = async(req,res)=>{
    try{
        const id = req.params.id ;
        const comment = await commentService.getCommentById(id);
        if(!comment){
            return res.status(404).json({message:"Comment not found"});
        }
        res.json(comment);

    }catch(err){
        res.status(500).json({message:"Failed to fetch comment",error:err.message})
    }
}

exports.createComment = async(req,res)=>{
    try{
        const answerId = req.params.answerId;
        const email = req.headers.email;
        const statement = req.body.statement;
        if(!statement){
            return res.status(400).json({message:"Statement is required"})
        }
        const comment = await commentService.createComment({statement}, answerId, email);
        res.status(201).send(comment);
    }catch(err){
        res.status(500).json({message:"Failed to create comment",error:err.message})
    }
}

exports.updateComment = async(req,res)=>{
    try{
        const id = req.params.id;
        const statement = req.body.statement;
        const email = req.headers.email;
        if(!statement){
            return res.status(400).json({message:"statement is required"});
        }
        const comment = await commentService.updateComment(id,{statement}, email);
        res.json(comment);
    
    }catch(err){
        res.status(500).json({message:"Failed to update comment",error:err.message})
    }
}
exports.likeComment = async(req,res)=>{
    try{
        const id = req.params.id;
        const comment = await commentService.likeComment(id);
        res.json(comment);
    
    }catch(err){
        res.status(500).json({message:"Failed to update comment",error:err.message})
    }
}

exports.dislikeComment = async(req,res)=>{
    try{
        const id = req.params.id;
        const comment = await commentService.dislikeComment(id);
        res.json(comment);
    
    }catch(err){
        res.status(500).json({message:"Failed to update comment",error:err.message})
    }
}

exports.deleteComment = async(req,res)=>{
    try{
        const id = req.params.id;
        const email = req.headers.email;
        const comment =await commentService.deleteComment(id, email);
        if(!comment){
            return res.status(404).json({message:"comment not found"});
        }
        res.json({message:"comment deleted successfully"})
    }catch(err){
        res.status(500).json({message:"Failed to delete comment",error:err.message})
    }
}
