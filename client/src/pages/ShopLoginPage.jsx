import React, { useEffect } from 'react'
import ShopLogin from '../components/Shop/ShopLogin'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ShopLoginPage() {
  const navigate = useNavigate();
  const isSeller = useSelector((state) => state.seller.isSeller);
  useEffect(() => {
    if (isSeller === true) {
      navigate("/dashboard");
    }
  }, [isSeller]);

  return (
    <div>
      <ShopLogin />
    </div>
  )
}
