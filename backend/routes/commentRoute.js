const express = require('express');
const router = express.Router();
const commentController=require('../controllers/commentController')
const {authorize} = require('../middleware/authMiddleware');


router.get('/answer/:answerId',commentController.getAllComments);  //get all comments of an answer
router.get('/:id',commentController.getCommentById); //get comment by Id
router.post('/:answerId',authorize('user'),commentController.createComment); //write a comment for an answer
router.put('/:id',authorize('user'),commentController.updateComment);  //update a comment
router.put('/like/:id',authorize('user'),commentController.likeComment); //user
router.put('/dislike/:id',authorize('user'),commentController.dislikeComment); //user
router.delete('/:id',authorize('user'),commentController.deleteComment); //delete a comment

module.exports=router;