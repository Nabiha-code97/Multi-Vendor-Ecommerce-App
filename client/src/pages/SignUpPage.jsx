import React, { useEffect } from 'react'
import SignUp from '../components/SignUp'
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';


export default function SignUpPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state)=>state.user.isAuthenticated);
  useEffect(()=>{
    if(isAuthenticated === true){
      navigate("/");
    }
  }, [isAuthenticated]);
  return (
    <div>
      <SignUp />
    </div>
  )
}
