import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const Settings = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    title: "",
    field: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        title: user.title || "",
        field: user.field || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Profil bilgilerini güncelle
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Zorunlu alanları kontrol et
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phoneNumber
      ) {
        toast.error("Lütfen zorunlu alanları doldurun!");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_KEY_CONNECTION_STRING}/user/updateUser`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          title: formData.title,
          field: formData.field,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.valid) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Profil bilgileri başarıyla güncellendi");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Profil güncellenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  // Şifre güncelleme
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_KEY_CONNECTION_STRING}/user/updatePassword`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.valid) {
        toast.success("Şifre başarıyla güncellendi");
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Şifre güncellenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      {/* Profil Bilgileri */}
      <Card className="mb-4">
        <Card.Body>
          <h2 className="text-center mb-4">Profil Ayarları</h2>
          <Form onSubmit={handleProfileUpdate}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Ad <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Adınız"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Soyad <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Soyadınız"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    E-posta <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ornek@email.com"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Telefon Numarası <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="+90 555 123 4567"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ünvan</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Örn: Yazılım Mühendisi"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alan</Form.Label>
                  <Form.Control
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    placeholder="Örn: Bilişim Teknolojileri"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button className="w-100" type="submit" disabled={loading}>
              {loading ? "Güncelleniyor..." : "Profili Güncelle"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Şifre Değiştirme */}
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Şifre Değiştir</h2>
          <Form onSubmit={handlePasswordUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Mevcut Şifre</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder="Mevcut şifrenizi girin"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Yeni Şifre</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Yeni şifrenizi girin"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Yeni Şifre (Tekrar)</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </Form.Group>

            <Button className="w-100" type="submit" disabled={loading}>
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
