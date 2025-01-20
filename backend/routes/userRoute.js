const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authorize} = require('../middleware/authMiddleware');

router.get('/', userController.getAllUsers);  //get all users
router.get('/:id',userController.getUserById);  //get user by id
router.get('/email/:emailId', userController.getUserByEmailId);  //get user by email
router.put('/:id',authorize('admin'),userController.updateUserById);  //update user status, only for admin

module.exports = router;