const express = require('express');
const router = express.Router();
const questionController=require('../controllers/questionController');
const {authorize} = require('../middleware/authMiddleware');


router.get('/',questionController.getAllQuestions);  //everyone can see all questions
router.get('/:id',questionController.getQuestionById);  //check question by id
router.post('/',authorize('user'),questionController.createQuestion); //create question
router.put('/statement/:id',authorize('user'),questionController.updateQuestionStatement); //only user can update statement
router.put('/status/:id',authorize('admin'),questionController.updateStatusFields); //only admin can approve or resolve the status
router.delete('/:id',authorize('user'),questionController.deleteQuestion); //user can delete own question

module.exports=router;
