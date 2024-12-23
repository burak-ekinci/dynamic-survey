import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnketSonuc = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3000/api/surveys/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Her anket için sonuçları al
        const surveysWithResults = await Promise.all(
          response.data.surveys.map(async (survey) => {
            try {
              const resultResponse = await axios.get(
                `http://localhost:3000/api/surveys/${survey._id}/results`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return {
                ...survey,
                results: resultResponse.data.results,
              };
            } catch (error) {
              return {
                ...survey,
                results: null,
              };
            }
          })
        );

        setSurveys(surveysWithResults);
        setLoading(false);
      } catch (error) {
        setError("Anketler yüklenirken bir hata oluştu");
        toast.error(error.response?.data?.message || "Bir hata oluştu");
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const toggleSurvey = (surveyId) => {
    if (selectedSurveyId === surveyId) {
      setSelectedSurveyId(null);
    } else {
      setSelectedSurveyId(surveyId);
    }
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

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tüm Anket Sonuçları</h2>
      <div className="accordion" id="surveyAccordion">
        {surveys.map((survey) => (
          <div className="accordion-item mb-3" key={survey._id}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${
                  selectedSurveyId !== survey._id && "collapsed"
                }`}
                type="button"
                onClick={() => toggleSurvey(survey._id)}
              >
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span>{survey.title}</span>
                  <small className="text-muted ms-3">
                    {survey.results
                      ? `${survey.results.totalResponses} Katılımcı`
                      : "Henüz yanıt yok"}
                  </small>
                </div>
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${
                selectedSurveyId === survey._id ? "show" : ""
              }`}
            >
              <div className="accordion-body">
                {survey.results ? (
                  <>
                    <div className="mb-4">
                      <h5>Toplam Katılımcı: {survey.results.totalResponses}</h5>
                    </div>
                    {survey.results.questions.map((question, qIndex) => (
                      <div key={qIndex} className="mb-4">
                        <div className="card">
                          <div className="card-header">
                            <h5 className="mb-0">
                              Soru {qIndex + 1}: {question.questionText}
                            </h5>
                          </div>
                          <div className="card-body">
                            <div style={{ height: "300px" }}>
                              <Bar
                                data={{
                                  labels: question.options.map(
                                    (option) => option.text
                                  ),
                                  datasets: [
                                    {
                                      label: "Oy Sayısı",
                                      data: question.options.map(
                                        (option) => option.votes
                                      ),
                                      backgroundColor: [
                                        "rgba(54, 162, 235, 0.6)",
                                        "rgba(255, 99, 132, 0.6)",
                                        "rgba(75, 192, 192, 0.6)",
                                        "rgba(255, 206, 86, 0.6)",
                                        "rgba(153, 102, 255, 0.6)",
                                      ],
                                      borderColor: [
                                        "rgba(54, 162, 235, 1)",
                                        "rgba(255, 99, 132, 1)",
                                        "rgba(75, 192, 192, 1)",
                                        "rgba(255, 206, 86, 1)",
                                        "rgba(153, 102, 255, 1)",
                                      ],
                                      borderWidth: 1,
                                    },
                                  ],
                                }}
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  scales: {
                                    y: {
                                      beginAtZero: true,
                                      ticks: {
                                        stepSize: 1,
                                      },
                                    },
                                  },
                                  plugins: {
                                    legend: {
                                      display: false,
                                    },
                                  },
                                }}
                              />
                            </div>
                            <div className="table-responsive mt-4">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th>Seçenek</th>
                                    <th>Oy Sayısı</th>
                                    <th>Yüzde</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {question.options.map((option, oIndex) => (
                                    <tr key={oIndex}>
                                      <td>{option.text}</td>
                                      <td>{option.votes}</td>
                                      <td>{option.percentage.toFixed(1)}%</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="alert alert-info">
                    Bu anket için henüz sonuç bulunmamaktadır.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnketSonuc;
