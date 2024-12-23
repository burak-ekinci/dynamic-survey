import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import BaseLayout from "./components/layouts/BaseLayout.jsx";
import NavbarComponent from "./components/ui/NavbarComponent.jsx";
import Login from "./components/ui/Login.jsx";
import Register from "./components/ui/Register.jsx";
import Settings from "./components/ui/Settings.jsx";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App.jsx";
import "./styles/footer.css";
// import "./styles/navbar.css";
import Home from "./components/ui/Home.jsx";
import AnketOlustur from "./components/ui/AnketOlustur.jsx";
import TumAnketler from "./components/ui/TumAnketler.jsx";
import AnketSonuc from "./components/ui/AnketSonuc.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BaseLayout children={<Home />} />,
  },
  {
    path: "/login",
    element: <BaseLayout children={<Login />} />,
  },
  {
    path: "/anket-sonuc",
    element: <BaseLayout children={<AnketSonuc />} />,
  },
  {
    path: "/tüm-anketler",
    element: <BaseLayout children={<TumAnketler />} />,
  },
  {
    path: "/anket-olustur",
    element: <BaseLayout children={<AnketOlustur />} />,
  },
  {
    path: "/settings",
    element: <BaseLayout children={<Settings />} />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer theme="colored" />
  </StrictMode>
);
