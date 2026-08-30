import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import App from './App'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Store from './redux/store'
import ActivationPage from './pages/ActivationPage'
import { loadUser, loadSeller } from './redux/actions/user'
import { getAllProducts } from './redux/actions/product'
import { getAllEvents } from './redux/actions/event'
import HomePage from './pages/HomePage'
import BestSellingPage from './pages/BestSellingPage'
import ProductsPage from './pages/ProductsPage'
import EventsPage from './pages/EventsPage'
import FAQPage from './pages/FAQPage'
import ShopCreatePage from './pages/ShopCreatePage'
import ShopLoginPage from './pages/ShopLoginPage'
import SellerActivationPage from './pages/SellerActivationPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentPage from './pages/PaymentPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import ShopDashboardPage from './pages/ShopDashboardPage'
import ShopAllProductsPage from './pages/ShopAllProductsPage'
import ShopCreateProductPage from './pages/ShopCreateProductPage'
import ShopAllOrdersPage from './pages/ShopAllOrdersPage'
import ShopOrderDetailsPage from './pages/ShopOrderDetailsPage'
import ShopSettingsPage from './pages/ShopSettingsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminDashboardOrdersPage from './pages/AdminDashboardOrdersPage'
import AdminDashboardSellersPage from './pages/AdminDashboardSellersPage'
import AdminDashboardUsersPage from './pages/AdminDashboardUsersPage'
import AdminDashboardProductsPage from './pages/AdminDashboardProductsPage'
import AdminDashboardWithdrawsPage from './pages/AdminDashboardWithdrawsPage'
import ProfilePage from './pages/ProfilePage'
import ShopAllEventsPage from './pages/ShopAllEventsPage'
import ShopCreateEventPage from './pages/ShopCreateEventPage'
import ShopAllCouponsPage from './pages/ShopAllCouponsPage'
import ShopWithdrawPage from './pages/ShopWithdrawPage'

export default function AppRoutes() {
  useEffect(()=>{
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
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
    <Route path='/checkout' element={<CheckoutPage/>} />
    <Route path='/payment' element={<PaymentPage/>} />
    <Route path='/order/success' element={<OrderSuccessPage/>} />
    <Route path='/dashboard' element={<ShopDashboardPage/>} />
    <Route path='/dashboard-products' element={<ShopAllProductsPage/>} />
    <Route path='/dashboard-create-product' element={<ShopCreateProductPage/>} />
    <Route path='/dashboard-orders' element={<ShopAllOrdersPage/>} />
    <Route path='/dashboard-order/:id' element={<ShopOrderDetailsPage/>} />
    <Route path='/dashboard-settings' element={<ShopSettingsPage/>} />
    <Route path='/admin-dashboard' element={<AdminDashboardPage/>} />
    <Route path='/admin-orders' element={<AdminDashboardOrdersPage/>} />
    <Route path='/admin-sellers' element={<AdminDashboardSellersPage/>} />
    <Route path='/admin-users' element={<AdminDashboardUsersPage/>} />
    <Route path='/admin-products' element={<AdminDashboardProductsPage/>} />
    <Route path='/admin-withdraws' element={<AdminDashboardWithdrawsPage/>} />
    <Route path='/profile' element={<ProfilePage/>} />
    <Route path='/dashboard-events' element={<ShopAllEventsPage/>} />
    <Route path='/dashboard-create-event' element={<ShopCreateEventPage/>} />
    <Route path='/dashboard-coupons' element={<ShopAllCouponsPage/>} />
    <Route path='/dashboard-withdraw' element={<ShopWithdrawPage/>} />
    </Routes>
    </>
  )
}
