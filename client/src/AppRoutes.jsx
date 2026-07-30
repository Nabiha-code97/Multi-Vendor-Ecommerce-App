import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from './App'
import Home from './Home'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ActivationPage from './pages/ActivationPage'

export default function AppRoutes() {
  return (
    <>
    <Routes>
    <Route path='/' element={<App/>} />
    <Route path='/login' element={<LoginPage/>} />
    <Route path='/sign-up' element={<SignUpPage/>} />
    <Route path='/activation/:activationToken' element={<ActivationPage/>}/>
    </Routes>
    </>
  )
}
