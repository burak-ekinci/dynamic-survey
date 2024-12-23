import React, { useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    title: "",
    field: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (
        formData.firstName == "" &&
        formData.lastName == "" &&
        formData.email == "" &&
        formData.password == "" &&
        formData.phoneNumber == "" &&
        formData.title == "" &&
        formData.field == ""
      ) {
        toast.error("Alanlar dolu olmalı!");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_KEY_CONNECTION_STRING}/auth/register`,
        formData
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        toast.success("Kayıt başarılı");
        navigate("/login");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Kayıt olurken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center m-2"
      style={{ minHeight: "80vh" }}
    >
      <Card style={{ width: "500px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Kayıt Ol</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon Numarası</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ünvan</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Alan</Form.Label>
              <Form.Control
                type="text"
                name="field"
                value={formData.field}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button className="w-100" type="submit" disabled={loading}>
              {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </Form>
        </Card.Body>
        <Container>
          <Row>
            <Col>
              <Link
                className="text-muted text-decoration-none float-end m-2"
                to="/login"
              >
                Üye misiniz? Giriş Yap
              </Link>
            </Col>
          </Row>
        </Container>
      </Card>
    </div>
  );
};

export default Register;
