import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Country, State } from "country-state-city";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "sonner";
import styles from "../../styles/styles";
import { updatUserAddress, deleteUserAddress } from "../../redux/actions/user";

const AddressBook = () => {
  const dispatch = useDispatch();
  const { user, addressLoading, error } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressType, setAddressType] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error]);

  const resetForm = () => {
    setCountry("");
    setCity("");
    setAddress1("");
    setAddress2("");
    setZipCode("");
    setAddressType("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!country || !city || !address1 || !zipCode || !addressType) {
      toast.error("Please fill in all required fields");
      return;
    }

    dispatch(updatUserAddress(country, city, address1, address2, zipCode, addressType))
      .then(() => {
        toast.success("Address added!");
        resetForm();
        setOpen(false);
      })
      .catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this address?")) {
      dispatch(deleteUserAddress(id)).catch(() => {});
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-[22px] font-[600]">Address Book</h3>
        <button onClick={() => setOpen(!open)} className={`${styles.button} !bg-black !w-[150px] !h-[40px]`}>
          <h5 className="text-white">{open ? "Cancel" : "Add Address"}</h5>
        </button>
      </div>

      {open && (
        <form className="w-full bg-white shadow-sm rounded-md p-5 mb-6" onSubmit={handleSubmit}>
          <label className="block pb-2">Address Type</label>
          <select
            className="w-full mb-4 border h-[40px] rounded-[5px]"
            value={addressType}
            onChange={(e) => setAddressType(e.target.value)}
          >
            <option value="">Choose address type</option>
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>

          <label className="block pb-2">Country</label>
          <select
            className="w-full mb-4 border h-[40px] rounded-[5px]"
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

          <label className="block pb-2">City</label>
          <select
            className="w-full mb-4 border h-[40px] rounded-[5px]"
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

          <label className="block pb-2">Address</label>
          <input value={address1} onChange={(e) => setAddress1(e.target.value)} className={`${styles.input} mb-4`} />

          <label className="block pb-2">Address 2 (optional)</label>
          <input value={address2} onChange={(e) => setAddress2(e.target.value)} className={`${styles.input} mb-4`} />

          <label className="block pb-2">Zip Code</label>
          <input
            type="number"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className={`${styles.input} mb-4`}
          />

          <button type="submit" disabled={addressLoading} className={`${styles.button} !bg-black disabled:opacity-50`}>
            <h5 className="text-white">{addressLoading ? "Saving..." : "Save Address"}</h5>
          </button>
        </form>
      )}

      {(!user?.addresses || user.addresses.length === 0) && <p>No saved addresses yet.</p>}
      {user?.addresses?.map((item) => (
        <div className="w-full bg-white shadow-sm rounded-md p-5 mb-3 flex justify-between items-center" key={item._id}>
          <div>
            <h5 className="font-[600]">{item.addressType}</h5>
            <p className="text-[#00000094]">
              {item.address1}
              {item.address2 ? `, ${item.address2}` : ""}, {item.city}, {item.country} - {item.zipCode}
            </p>
          </div>
          <AiOutlineDelete size={20} className="cursor-pointer" onClick={() => handleDelete(item._id)} />
        </div>
      ))}
    </div>
  );
};

export default AddressBook;
