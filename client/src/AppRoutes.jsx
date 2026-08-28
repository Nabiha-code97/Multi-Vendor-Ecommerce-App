import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Store from './redux/store'
import ActivationPage from './pages/ActivationPage'
import { loadUser, loadSeller } from './redux/actions/user'
import { getAllProducts } from './redux/actions/product'
import HomePage from './pages/HomePage'
import BestSellingPage from './pages/BestSellingPage'
import ProductsPage from './pages/ProductsPage'
import EventsPage from './pages/EventsPage'
import FAQPage from './pages/FAQPage'
import ShopCreatePage from './pages/ShopCreatePage'
import ShopLoginPage from './pages/ShopLoginPage'
import SellerActivationPage from './pages/SellerActivationPage'
import ProductDetailsPage from './pages/ProductDetailsPage'

export default function AppRoutes() {
  useEffect(()=>{
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
  },[]);
  return (
    <>
    <Routes>
    <Route path='/' element={<HomePage/>} />
    <Route path='/login' element={<LoginPage/>} />
    <Route path='/sign-up' element={<SignUpPage/>} />
    <Route path='/activation/:activationToken' element={<ActivationPage/>}/>
    <Route path='/best-selling' element={<BestSellingPage/>} />
    <Route path='/products' element={<ProductsPage/>} />
    <Route path='/events' element={<EventsPage/>} />
    <Route path='/faq' element={<FAQPage/>} />
    <Route path='/shop-create' element={<ShopCreatePage/>} />
    <Route path='/shop-login' element={<ShopLoginPage/>} />
    <Route path='/seller/activation/:activationToken' element={<SellerActivationPage/>}/>
    <Route path='/product/:id' element={<ProductDetailsPage/>} />
    </Routes>
    </>
  )
}
