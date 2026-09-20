import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";

const NotFoundPage = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center py-[100px]">
        <h1 className="text-[60px] font-[700] text-[#333]">404</h1>
        <p className="text-[18px] text-[#555] pb-6">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/" className={`${styles.button} !w-auto px-6 text-white`}>
          Go back home
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
