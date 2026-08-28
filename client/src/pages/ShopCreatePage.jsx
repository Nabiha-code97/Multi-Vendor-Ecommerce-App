import React, { useEffect } from 'react'
import ShopCreate from '../components/Shop/ShopCreate'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ShopCreatePage() {
  const navigate = useNavigate();
  const isSeller = useSelector((state) => state.seller.isSeller);
  useEffect(() => {
    if (isSeller === true) {
      navigate("/dashboard");
    }
  }, [isSeller]);

  return (
    <div>
      <ShopCreate />
    </div>
  )
}
