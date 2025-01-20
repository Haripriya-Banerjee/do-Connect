const express = require('express');
const router = express.Router();
const answerController=require('../controllers/answerController')
const {authorize} = require('../middleware/authMiddleware');


router.get('/question/:questionId',answerController.getAllAnswers);  //get all answers for a particular question
router.get('/:id',answerController.getAnswerById);  //get answer by id
router.post('/:questionId',authorize('user'),answerController.createAnswer);  //write an answer
router.put('/:id',authorize('user'),answerController.updateAnswer);  //update an answer statement
router.put('/approve/:id',authorize('admin'),answerController.aproveAnswer);  //admin can approve the answer
router.put('/like/:id',authorize('user'),answerController.likeAnswer);  //user
router.put('/dislike/:id',authorize('user'),answerController.dislikeAnswer);  //user
router.delete('/:id',authorize('user'),answerController.deleteAnswer); //delete the answer of your own

module.exports=router;