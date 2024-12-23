import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Footer = () => {
  const navigate = useNavigate();

  const checkAuthAndNavigate = (path) => {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();

    if (!user) {
      toast.warning("Bu sayfaya erişmek için giriş yapmalısınız");
      navigate("/login");
      return;
    }

    navigate(path);
  };

  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <Container>
        <Row className="g-4">
          {/* Logo ve Açıklama */}
          <Col md={4}>
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-card-checklist me-2 fs-4"></i>
              <h5 className="mb-0">Dinamik Anket</h5>
            </div>
            <p className="">
              Modern ve kullanıcı dostu rehber uygulaması ile tüm
              bağlantılarınızı güvenle saklayın ve yönetin.
            </p>
          </Col>

          {/* Hızlı Erişim */}
          <Col md={4}>
            <h5>Hızlı Erişim</h5>
            <ul className="list-unstyled">
              <li>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/");
                  }}
                  className="text-decoration-none"
                >
                  <i className="bi bi-house-door me-2"></i>
                  Ana Sayfa
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    checkAuthAndNavigate("/anket-olustur");
                  }}
                  className="text-decoration-none"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Anket Oluştur
                </a>
              </li>
              <li>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/tüm-anketler");
                  }}
                  className="text-decoration-none"
                >
                  <i className="bi bi-list-ul me-2"></i>
                  Tüm Anketler
                </a>
              </li>
            </ul>
          </Col>

          {/* İletişim */}
          <Col md={4}>
            <h5>İletişim</h5>
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-envelope me-2"></i>
                info@dinamikanket.com
              </li>
              <li>
                <i className="bi bi-telephone me-2"></i>
                +90 (555) 123 45 67
              </li>
              <li>
                <i className="bi bi-geo-alt me-2"></i>
                İstanbul, Türkiye
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
