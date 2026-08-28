import React, { useEffect } from 'react'
import Login from '../components/Login'
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state)=>state.user.isAuthenticated);
  useEffect(()=>{
    if(isAuthenticated === true){
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Login/>
    </div>
  )
}
