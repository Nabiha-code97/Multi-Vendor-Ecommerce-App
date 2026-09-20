import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const ActivationPage = () => {
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
          .post(`${import.meta.env.VITE_API_URL}/api/user/activation`, {
            activationToken,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            const message = err.response?.data?.message || "";
            setError(message === "User already exists" ? "already-activated" : "expired");
          });
      };
      sendRequest();
    }
  }, [activationToken]);

  const alreadyActivated = error === "already-activated";

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
        <p>Your account has been created successfully!</p>
      ) : alreadyActivated ? (
        <p>This account is already activated. Please log in.</p>
      ) : (
        <p>This activation link is invalid or has expired. Please sign up again.</p>
      )}
      <div style={{ display: "flex", gap: "16px" }}>
        <Link to="/">Go to homepage</Link>
        {alreadyActivated && <Link to="/login">Go to login</Link>}
        {!error && <Link to="/login">Go to login</Link>}
        {error === "expired" && <Link to="/sign-up">Sign up again</Link>}
      </div>
    </div>
  );
};

export default ActivationPage;