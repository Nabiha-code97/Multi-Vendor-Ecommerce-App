import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const SellerActivationPage = () => {
  const { activationToken } = useParams();
  const [error, setError] = useState(null);
  // StrictMode double-invokes effects in dev; the activation request isn't idempotent
  // (a second call fails with "already exists"), so this guard is what keeps it to one call
  const requestSent = useRef(false);

  useEffect(() => {
    if (activationToken && !requestSent.current) {
      requestSent.current = true;
      const sendRequest = async () => {
        await axios
          .post(`${import.meta.env.VITE_API_URL}/api/shop/activation`, {
            activationToken,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            setError(err.response?.data?.message || "Activation failed");
          });
      };
      sendRequest();
    }
  }, [activationToken]);

  const alreadyActivated = error === "Shop already exists";

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {!error ? (
        <p>Your shop has been created successfully!</p>
      ) : alreadyActivated ? (
        <p>This shop is already activated. Please log in.</p>
      ) : (
        <p>{error}</p>
      )}
      <div style={{ display: "flex", gap: "16px" }}>
        <Link to="/">Go to homepage</Link>
        {(alreadyActivated || !error) && <Link to="/shop-login">Go to shop login</Link>}
      </div>
    </div>
  );
};

export default SellerActivationPage;
