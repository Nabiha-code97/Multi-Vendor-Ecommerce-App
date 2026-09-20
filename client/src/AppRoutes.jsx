import React, { useEffect, Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from './components/Layout/Loader'
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
import ShopPreviewPage from './pages/ShopPreviewPage'
import NotFoundPage from './pages/NotFoundPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import CheckoutPage from './pages/CheckoutPage'
// lazy-loaded: PaymentPage pulls in stripe.js, which must not initialize until the payment route is actually visited
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
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
import InboxPage from './pages/InboxPage'
import ShopInboxPage from './pages/ShopInboxPage'

export default function AppRoutes() {
  useEffect(()=>{
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
  },[]);
  return (
    <>
    <Suspense fallback={<Loader />}>
    <Routes>
    <Route path='/' element={<HomePage/>} />
    <Route path='/login' element={<LoginPage/>} />
    <Route path='/sign-up' element={<SignUpPage/>} />
    <Route path='/forgot-password' element={<ForgotPasswordPage/>} />
    <Route path='/reset-password/:token' element={<ResetPasswordPage/>} />
    <Route path='/activation/:activationToken' element={<ActivationPage/>}/>
    <Route path='/best-selling' element={<BestSellingPage/>} />
    <Route path='/products' element={<ProductsPage/>} />
    <Route path='/events' element={<EventsPage/>} />
    <Route path='/faq' element={<FAQPage/>} />
    <Route path='/shop-create' element={<ShopCreatePage/>} />
    <Route path='/shop-login' element={<ShopLoginPage/>} />
    <Route path='/seller/activation/:activationToken' element={<SellerActivationPage/>}/>
    <Route path='/product/:id' element={<ProductDetailsPage/>} />
    <Route path='/shop/preview/:id' element={<ShopPreviewPage/>} />
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
    <Route path='/inbox' element={<InboxPage/>} />
    <Route path='/inbox/:conversationId' element={<InboxPage/>} />
    <Route path='/dashboard-messages' element={<ShopInboxPage/>} />
    <Route path='/dashboard-messages/:conversationId' element={<ShopInboxPage/>} />
    <Route path='*' element={<NotFoundPage/>} />
    </Routes>
    </Suspense>
    </>
  )
}
