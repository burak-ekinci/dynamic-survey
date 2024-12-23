import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const NavbarComponent = () => {
  const navigate = useNavigate();

  // Kullanıcı bilgisini güvenli bir şekilde almak için fonksiyon
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("User parse error:", error);
      // Hata durumunda localStorage'ı temizle
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return null;
    }
  };

  const user = getUserFromStorage();

  // Çıkış işlemi için fonksiyon
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        {/* Logo ve Marka */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <i className="bi bi-card-checklist me-2 text-light"></i>
          <span className="fw-bold">Dinamik Anket</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Orta Kısım - Navigasyon Linkleri */}
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/tüm-anketler" className="mx-2">
              Tüm Anketler
            </Nav.Link>

            {user && (
              <>
                <Nav.Link as={Link} to="/anket-olustur" className="mx-2">
                  Anket Ekle
                </Nav.Link>
                <Nav.Link as={Link} to="/anket-sonuc" className="mx-2">
                  Anket Sonuç
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Sağ Taraf - Profil veya Giriş Yap */}
          <Nav>
            {user ? (
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center">
                    <i className="bi bi-person-gear me-2"></i>
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                }
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/settings">
                  Ayarlar
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Çıkış Yap
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                className="btn btn-outline-light ms-2"
              >
                Giriş Yap
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
