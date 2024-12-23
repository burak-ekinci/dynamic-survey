import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row align-items-center text-center text-md-start">
        <div className="col-md-6">
          <h1 className="display-4 fw-bold mb-3">Dinamik Anket Platformu</h1>
          <p className="lead">
            Kolay ve etkili anketler oluşturun, hedef kitlenizin görüşlerini
            analiz edin ve veriye dayalı kararlar alın.
          </p>
        </div>
        <div className="col-md-6 text-center">
          <i
            className="bi bi-card-checklist text-primary"
            style={{ fontSize: "5rem" }}
          ></i>
        </div>
      </div>

      {/* Özellikler */}
      <div className="row text-center my-5">
        <div className="col-md-4">
          <div className="bg-light p-4 rounded shadow-sm">
            <i className="bi bi-pencil-square text-primary fs-1 mb-3"></i>
            <h3 className="h5">Kolay Anket Oluşturma</h3>
            <p>
              Sürükle-bırak arayüzü ile dakikalar içinde profesyonel anketler
              oluşturun.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-light p-4 rounded shadow-sm">
            <i className="bi bi-graph-up text-primary fs-1 mb-3"></i>
            <h3 className="h5">Gerçek Zamanlı Analiz</h3>
            <p>
              Anket sonuçlarını anlık olarak takip edin ve detaylı raporlar
              alın.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-light p-4 rounded shadow-sm">
            <i className="bi bi-shield-check text-primary fs-1 mb-3"></i>
            <h3 className="h5">Güvenli ve Anonim</h3>
            <p>
              Katılımcıların gizliliğini koruyun ve güvenilir veriler elde edin.
            </p>
          </div>
        </div>
      </div>

      {/* Avantajlar */}
      <div className="row mt-5">
        <div className="col-12 text-center mb-4">
          <h2 className="fw-bold">Neden Dinamik Anket?</h2>
        </div>
        <div className="col-md-6">
          <div className="d-flex mb-4">
            <i className="bi bi-lightning-charge text-primary fs-4 me-3"></i>
            <div>
              <h4 className="h5">Hızlı ve Kolay</h4>
              <p>
                Kullanıcı dostu arayüz ile anketlerinizi hızlıca oluşturun ve
                paylaşın.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex mb-4">
            <i className="bi bi-phone text-primary fs-4 me-3"></i>
            <div>
              <h4 className="h5">Mobil Uyumlu</h4>
              <p>
                Her cihazda mükemmel görünen ve kolay doldurulan anketler
                oluşturun.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex mb-4">
            <i className="bi bi-bar-chart text-primary fs-4 me-3"></i>
            <div>
              <h4 className="h5">Detaylı Raporlama</h4>
              <p>
                Görsel grafikler ve detaylı analizlerle verilerinizi kolayca
                yorumlayın.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex mb-4">
            <i className="bi bi-share text-primary fs-4 me-3"></i>
            <div>
              <h4 className="h5">Kolay Paylaşım</h4>
              <p>
                Anketlerinizi e-posta veya link ile hızlıca paylaşın ve
                yanıtları toplayın.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="row mt-5">
        <div className="col-12 text-center">
          <div className="bg-primary text-white p-5 rounded">
            <h2 className="fw-bold mb-3">Hemen Başlayın!</h2>

            <button
              onClick={() => navigate("/tüm-anketler")}
              className="btn btn-light btn-lg"
            >
              Ücretsiz Kaydol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
