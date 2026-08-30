import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ActivationPage = () => {
  const { activationToken } = useParams();
  const [error, setError] = useState(false);
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
            setError(true);
          });
      };
      sendRequest();
    }
  }, [activationToken]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your token is expired!</p>
      ) : (
        <p>Your account has been created successfully!</p>
      )}
    </div>
  );
};

export default ActivationPage;