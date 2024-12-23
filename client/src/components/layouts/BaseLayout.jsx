import React from "react";
import NavbarComponent from "../ui/NavbarComponent";
import Footer from "../ui/Footer";

const BaseLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavbarComponent />
      <div className="flex-grow-1">{children}</div>
      <Footer />
    </div>
  );
};

export default BaseLayout;
