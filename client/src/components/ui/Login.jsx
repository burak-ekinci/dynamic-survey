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

const Login = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
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
      if (formData.phoneNumber === "" || formData.password === "") {
        toast.error("Alanlar dolu olmalı!");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_KEY_CONNECTION_STRING}/auth/login`,
        formData
      );

      if (response.data.valid !== false) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/anket-sonuc");
        toast.success("Giriş başarılı");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Giriş yapılırken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card style={{ width: "500px" }}>
        <Card.Body>
          <h3 className="text-start mb-4">Giriş Yap</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Telefon Numarası</Form.Label>
              <Form.Control
                type="phone"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
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
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
