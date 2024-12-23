const { default: mongoose } = require('mongoose');
const Survey = require('../models/SurveyModel');

// Yeni anket oluştur
const createSurvey = async (req, res) => {
  try {
    const { title, description, questions, endDate } = req.body;
    
    const survey = await Survey.create({
      title,
      description,
      questions,
      endDate,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Anket başarıyla oluşturuldu',
      survey,
      valid: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Anket oluşturulurken hata oluştu',
      error: error.message,
      valid: false
    });
  }
};

// Tüm anketleri getir
const getAllSurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ createdBy: new mongoose.Types.ObjectId("675fe07557dc573783e60ea9") })
      .sort({ createdAt: -1 });

    res.json({
      surveys,
      message: 'Anketler başarıyla getirildi',
      valid: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Anketler getirilirken hata oluştu',
      error: error.message,
      valid: false
    });
  }
};

// Tek bir anketi getir
const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).json({
        message: 'Anket bulunamadı',
        valid: false
      });
    }

    res.json({
      survey,
      message: 'Anket başarıyla getirildi',
      valid: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Anket getirilirken hata oluştu',
      error: error.message,
      valid: false
    });
  }
};

// Anketi güncelle
const updateSurvey = async (req, res) => {
  try {
    const { title, description, questions, isActive, endDate } = req.body;
    
    const survey = await Survey.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { title, description, questions, isActive, endDate },
      { new: true }
    );

    if (!survey) {
      return res.status(404).json({
        message: 'Anket bulunamadı',
        valid: false
      });
    }

    res.json({
      survey,
      message: 'Anket başarıyla güncellendi',
      valid: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Anket güncellenirken hata oluştu',
      error: error.message,
      valid: false
    });
  }
};

// Anketi sil
const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!survey) {
      return res.status(404).json({
        message: 'Anket bulunamadı',
        valid: false
      });
    }

    res.json({
      message: 'Anket başarıyla silindi',
      valid: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Anket silinirken hata oluştu',
      error: error.message,
      valid: false
    });
  }
};

// Anket sonuçlarını getir
const getSurveyResults = async (req, res) => {
  try {
    const survey = await Survey.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!survey) {
      return res.status(404).json({
        message: 'Anket bulunamadı',
        valid: false
      });
    }

    const results = {
      totalResponses: survey.responses.length,
      questions: survey.questions.map(question => ({
        questionText: question.questionText,
        options: question.options.map(option => ({
          text: option.text,
          votes: option.votes,
          percentage: (option.votes / (survey.responses.length || 1)) * 100
        }))
      }))
    };

    res.json({
      results,
      message: 'Anket sonuçları başarıyla getirildi',
      valid: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Anket sonuçları getirilirken hata oluştu',
      error: error.message,
      valid: false
    });
  }
};

// Anket cevaplarını kaydet
const submitSurvey = async (req, res) => {
  try {
    const { answers } = req.body;
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({
        message: 'Anket bulunamadı',
        valid: false
      });
    }

    // Anketin süresi dolmuş mu kontrol et
    if (survey.endDate && new Date(survey.endDate) < new Date()) {
      return res.status(400).json({
        message: 'Bu anketin süresi dolmuştur',
        valid: false
      });
    }

    // Cevapları kaydet ve oy sayılarını güncelle
    Object.entries(answers).forEach(([questionId, selectedOptionId]) => {
      const question = survey.questions.id(questionId);
      if (question) {
        const option = question.options.id(selectedOptionId);
        if (option) {
          option.votes += 1;
        }
      }
    });

    // Yanıtı kaydet
    survey.responses.push({
      answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOption: selectedOptionId
      }))
    });

    await survey.save();

    res.json({
      message: 'Anket yanıtları başarıyla kaydedildi',
      valid: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Anket yanıtları kaydedilirken hata oluştu',
      error: error.message,
      valid: false
    });
  }
};

module.exports = {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
  getSurveyResults,
  submitSurvey
}; 