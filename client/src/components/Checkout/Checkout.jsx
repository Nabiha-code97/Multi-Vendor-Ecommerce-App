import React, { useEffect, useState } from "react";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import styles from "../../styles/styles";

const Checkout = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // wait for loadUser() to resolve first — redirecting on the not-yet-loaded default
    // would boot an already-logged-in user straight back to /login on every page refresh
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login");
    } else if (!cart || cart.length === 0) {
      navigate("/");
    }
  }, [isAuthenticated, loading, cart, navigate]);

  const subTotalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  const applySavedAddress = (address) => {
    setAddress1(address.address1);
    setAddress2(address.address2 || "");
    setZipCode(address.zipCode || "");
    setCountry(address.country || "");
    setCity(address.city || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address1 || !zipCode || !country || !city) {
      toast.error("Please fill in your shipping address");
      return;
    }

    const shippingAddress = { country, city, address1, address2, zipCode };

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-payment-intent`,
        {
          cart: cart.map((item) => ({ _id: item._id, qty: item.qty, itemType: item.itemType })),
          shippingAddress,
        },
        { withCredentials: true }
      );

      navigate("/payment", { state: { clientSecret: data.clientSecret } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
            <h5 className="text-[18px] font-[500]">Shipping Address</h5>
            <br />
            <form onSubmit={handleSubmit}>
              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className={`${styles.input} !w-[95%] bg-gray-100`}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className={`${styles.input} bg-gray-100`}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Country</label>
                  <select
                    className="w-[95%] border h-[40px] rounded-[5px]"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setCity("");
                    }}
                  >
                    <option value="">Choose your country</option>
                    {Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">City</label>
                  <select
                    className="w-[95%] border h-[40px] rounded-[5px]"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Choose your city</option>
                    {State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Address</label>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    className={`${styles.input} !w-[95%]`}
                  />
                </div>
                <div className="w-[50%]">
                  <label className="block pb-2">Address 2 (optional)</label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    className={`${styles.input}`}
                  />
                </div>
              </div>

              <div className="w-full flex pb-3">
                <div className="w-[50%]">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="number"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className={`${styles.input} !w-[95%]`}
                  />
                </div>
              </div>

              {user?.addresses?.length > 0 && (
                <>
                  <h5
                    className="text-[16px] cursor-pointer inline-block text-blue-500"
                    onClick={() => setShowSavedAddresses(!showSavedAddresses)}
                  >
                    Choose from saved addresses
                  </h5>
                  {showSavedAddresses && (
                    <div className="mt-2">
                      {user.addresses.map((item, index) => (
                        <div className="w-full flex items-center mt-1" key={index}>
                          <input
                            type="radio"
                            name="savedAddress"
                            className="mr-3"
                            onChange={() => applySavedAddress(item)}
                          />
                          <h2>{item.addressType || `Address ${index + 1}`}</h2>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`${styles.button} w-[150px] 800px:w-[280px] mt-10 disabled:opacity-50`}
              >
                <h5 className="text-white">{submitting ? "Please wait..." : "Go to Payment"}</h5>
              </button>
            </form>
          </div>
        </div>

        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
              <h3 className="text-[16px] font-[400] text-[#000000a4]">{cart.length} item(s):</h3>
              <h5 className="text-[18px] font-[600]">${subTotalPrice.toFixed(2)}</h5>
            </div>
            <br />
            <h5 className="text-[18px] font-[600] text-end pt-3 border-t">
              ${subTotalPrice.toFixed(2)}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
