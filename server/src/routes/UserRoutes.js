const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/getuser', authMiddleware, userController.getUser);
router.post('/addMate', authMiddleware, userController.addMate);
router.get('/mates', authMiddleware, userController.getMates);
router.delete('/mates/:mateId', authMiddleware, userController.removeMate);
router.put('/updateUser', authMiddleware, userController.updateUser);
router.put('/updatePassword', authMiddleware, userController.updatePassword);
router.delete('/deleteUser', authMiddleware, userController.deleteUser);
router.post('/searchMates', authMiddleware, userController.searchMates);
router.delete('/deleteMateByEmail', authMiddleware, userController.deleteMateByEmail);



module.exports = router; 