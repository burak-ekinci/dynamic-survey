import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TumAnketler = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Kullanıcı bilgisini al
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoggedInUserId(user.id);
    }
  }, []);

  // Tüm anketleri getir
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/surveys/all"
        );
        console.log(response.data.surveys);
        setSurveys(response.data.surveys);
        setLoading(false);
      } catch (error) {
        setError("Anketler yüklenirken bir hata oluştu");
        toast.error(error.response?.data?.error || "Bir hata oluştu");
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // Anketi sil
  const handleDeleteSurvey = async (surveyId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3000/api/surveys/${surveyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.valid) {
        toast.success("Anket başarıyla silindi");
        // Anketleri güncelle
        setSurveys(surveys.filter((survey) => survey._id !== surveyId));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Anket silinirken bir hata oluştu"
      );
    }
  };

  // Anketi seç
  const handleSurveySelect = (survey) => {
    setSelectedSurvey(survey);
    // Her soru için boş cevap objesi oluştur
    const initialAnswers = {};
    survey.questions.forEach((question) => {
      initialAnswers[question._id] = "";
    });
    setAnswers(initialAnswers);
    setError("");
    setSuccess("");
  };

  // Cevapları kaydet
  const handleAnswerChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  // Anketi gönder
  const handleSubmitSurvey = async () => {
    try {
      // Tüm soruların cevaplanıp cevaplanmadığını kontrol et
      const unansweredQuestions = selectedSurvey.questions.filter(
        (question) => !answers[question._id]
      );

      if (unansweredQuestions.length > 0) {
        setError("Lütfen tüm soruları cevaplayınız");
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/api/surveys/${selectedSurvey._id}/submit`,
        { answers }
      );

      if (response.data.valid) {
        setSuccess("Anket başarıyla gönderildi!");
        setSelectedSurvey(null);
        setAnswers({});
      }
    } catch (error) {
      setError(error.response?.data?.message || "Bir hata oluştu");
    }
  };

  // Anketten çık
  const handleCloseSurvey = () => {
    setSelectedSurvey(null);
    setAnswers({});
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!selectedSurvey ? (
        // Anket Listesi
        <div className="row">
          {surveys.map((survey) => (
            <div key={survey._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{survey.title}</h5>
                  <p className="card-text">{survey.description}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Bitiş Tarihi:{" "}
                      {new Date(survey.endDate).toLocaleDateString("tr-TR")}
                    </small>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSurveySelect(survey)}
                    >
                      Anketi Doldur
                    </button>
                    {/* Sadece anket sahibi görebilir */}
                    {loggedInUserId && survey.createdBy === loggedInUserId && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteSurvey(survey._id)}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Seçilen Anket
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3>{selectedSurvey.title}</h3>
            <button className="btn btn-secondary" onClick={handleCloseSurvey}>
              Anketten Çık
            </button>
          </div>
          <div className="card-body">
            <p className="card-text">{selectedSurvey.description}</p>
            {selectedSurvey.questions.map((question, questionIndex) => (
              <div key={question._id} className="mb-4">
                <h5>
                  {questionIndex + 1}. {question.questionText}
                </h5>
                <div className="ms-4">
                  {question.options.map((option) => (
                    <div key={option._id} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question_${question._id}`}
                        id={`option_${option._id}`}
                        value={option._id}
                        checked={answers[question._id] === option._id}
                        onChange={() =>
                          handleAnswerChange(question._id, option._id)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`option_${option._id}`}
                      >
                        {option.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="d-grid gap-2">
              <button className="btn btn-primary" onClick={handleSubmitSurvey}>
                Anketi Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TumAnketler;
