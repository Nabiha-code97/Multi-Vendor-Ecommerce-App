import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import styles from "../../styles/styles";
import { stripePromise } from "../../lib/stripe";
import { clearCart } from "../../redux/actions/cart";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const clientSecret = location.state?.clientSecret;

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  if (!clientSecret) {
    navigate("/checkout");
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            <h5 className="text-[18px] font-[500] pb-4">Pay with card</h5>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CardPaymentForm />
            </Elements>
          </div>
        </div>

        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">{cart.length} item(s):</h3>
              <h5 className="text-[18px] font-[600]">${totalPrice.toFixed(2)}</h5>
            </div>
            <br />
            <h5 className="text-[18px] font-[600] text-end pt-3 border-t">
              ${totalPrice.toFixed(2)}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardPaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/order/success`,
      },
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      dispatch(clearCart());
      toast.success("Order successful!");
      navigate("/order/success");
    } else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`${styles.button} !bg-[#f63b60] w-full mt-8 disabled:opacity-50`}
      >
        <h5 className="text-white">{processing ? "Processing..." : "Pay Now"}</h5>
      </button>
    </form>
  );
};

export default Payment;
