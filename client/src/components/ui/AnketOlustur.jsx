import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnketOlustur = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    endDate: "",
    questions: [{ questionText: "", options: [{ text: "" }, { text: "" }] }],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Soru ekleme fonksiyonu
  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { questionText: "", options: [{ text: "" }, { text: "" }] },
      ],
    });
  };

  // Seçenek ekleme fonksiyonu
  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push({ text: "" });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Soru silme fonksiyonu
  const handleRemoveQuestion = (questionIndex) => {
    const updatedQuestions = formData.questions.filter(
      (_, index) => index !== questionIndex
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Seçenek silme fonksiyonu
  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, index) => index !== optionIndex);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Input değişikliklerini takip etme
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soru metnini güncelleme
  const handleQuestionChange = (questionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].questionText = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Seçenek metnini güncelleme
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/surveys/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.valid) {
        setSuccess("Anket başarıyla oluşturuldu!");
        setTimeout(() => {
          navigate("/tüm-anketler"); // Anketler sayfasına yönlendir
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Bir hata oluştu");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Yeni Anket Oluştur</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                {/* Anket Başlığı */}
                <div className="mb-3">
                  <label className="form-label">Anket Başlığı</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Anket Açıklaması */}
                <div className="mb-3">
                  <label className="form-label">Açıklama</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                {/* Bitiş Tarihi */}
                <div className="mb-3">
                  <label className="form-label">Bitiş Tarihi</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Sorular */}
                {formData.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="card mb-3">
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">
                          Soru {questionIndex + 1}
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={question.questionText}
                            onChange={(e) =>
                              handleQuestionChange(
                                questionIndex,
                                e.target.value
                              )
                            }
                            required
                          />
                          {formData.questions.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() =>
                                handleRemoveQuestion(questionIndex)
                              }
                            >
                              Soruyu Sil
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Seçenekler */}
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-2">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder={`Seçenek ${optionIndex + 1}`}
                              value={option.text}
                              onChange={(e) =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              required
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() =>
                                  handleRemoveOption(questionIndex, optionIndex)
                                }
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Seçenek Ekle Butonu */}
                      <button
                        type="button"
                        className="btn btn-info mt-2"
                        onClick={() => handleAddOption(questionIndex)}
                      >
                        Seçenek Ekle
                      </button>
                    </div>
                  </div>
                ))}

                {/* Soru Ekle Butonu */}
                <button
                  type="button"
                  className="btn btn-success mb-3"
                  onClick={handleAddQuestion}
                >
                  Yeni Soru Ekle
                </button>

                {/* Gönder Butonu */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Anketi Oluştur
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnketOlustur;
