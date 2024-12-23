const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema]
});

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  responses: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [{
      questionId: { type: mongoose.Schema.Types.ObjectId },
      selectedOption: { type: mongoose.Schema.Types.ObjectId }
    }],
    submittedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Survey', surveySchema); 