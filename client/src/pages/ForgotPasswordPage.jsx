import React, { useEffect } from 'react'
import ForgotPassword from '../components/ForgotPassword'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <ForgotPassword />
    </div>
  )
}
