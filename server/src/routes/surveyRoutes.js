const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/SurveyController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, surveyController.createSurvey);
router.get('/all',  surveyController.getAllSurveys);
router.get('/:id',  surveyController.getSurveyById);
router.put('/:id', authMiddleware, surveyController.updateSurvey);
router.delete('/:id', authMiddleware, surveyController.deleteSurvey);
router.get('/:id/results', authMiddleware, surveyController.getSurveyResults);
router.post('/:id/submit', surveyController.submitSurvey);

module.exports = router; 