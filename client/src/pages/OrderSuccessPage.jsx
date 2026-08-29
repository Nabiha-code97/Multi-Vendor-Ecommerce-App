import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { clearCart } from "../redux/actions/cart";

const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  // covers the case where Stripe redirected the browser here directly (some payment
  // methods require a redirect), so the cart wasn't already cleared by the Payment page.
  useEffect(() => {
    if (cart.length > 0) {
      dispatch(clearCart());
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="w-full flex flex-col items-center justify-center py-20">
        <IoCheckmarkCircleOutline size={80} className="text-[#4caf50]" />
        <h1 className="text-[25px] font-[600] pt-4">Your order is successful!</h1>
        <p className="text-[#00000094] pt-2">
          Thanks for your order. We'll email you the details shortly.
        </p>
        <Link to="/">
          <div className="w-[150px] bg-black h-[45px] mt-8 flex items-center justify-center rounded-xl cursor-pointer">
            <h5 className="text-white">Continue Shopping</h5>
          </div>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
