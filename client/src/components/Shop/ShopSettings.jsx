import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "sonner";
import styles from "../../styles/styles";
import {
  updateSellerInfo,
  updateShopAvatar,
  updatePaymentMethods,
  deleteWithdrawMethod,
} from "../../redux/actions/seller";

const ShopSettings = () => {
  const dispatch = useDispatch();
  const { seller, updateLoading, error } = useSelector((state) => state.seller);

  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipCode] = useState(seller?.zipCode || "");
  const [avatarFile, setAvatarFile] = useState(null);

  const [bankName, setBankName] = useState(seller?.withdrawMethod?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(seller?.withdrawMethod?.accountNumber || "");
  const [accountHolder, setAccountHolder] = useState(seller?.withdrawMethod?.accountHolder || "");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error]);

  const avatarPreview = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile]);
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);

    const formData = new FormData();
    formData.append("avatar", file);
    dispatch(updateShopAvatar(formData))
      .then(() => toast.success("Avatar updated!"))
      .catch(() => {}); // the error toast is handled by the `error` effect above
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSellerInfo(name, description, address, phoneNumber, zipCode))
      .then(() => toast.success("Shop info updated!"))
      .catch(() => {});
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePaymentMethods({ bankName, accountNumber, accountHolder }))
      .then(() => toast.success("Payout method saved!"))
      .catch(() => {});
  };

  const handleWithdrawDelete = () => {
    dispatch(deleteWithdrawMethod())
      .then(() => {
        setBankName("");
        setAccountNumber("");
        setAccountHolder("");
        toast.success("Payout method removed!");
      })
      .catch(() => {});
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pb-10">
      <div className="flex w-full 800px:w-[80%] flex-col items-center my-5">
        <div className="relative">
          <img
            src={avatarPreview || seller?.avatar?.url}
            alt=""
            className="w-[150px] h-[150px] rounded-full object-cover"
          />
          <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            <label htmlFor="avatar-upload">
              <AiOutlineCamera />
            </label>
          </div>
        </div>
      </div>

      <form className="w-full 800px:w-[50%] bg-white shadow-sm rounded-md p-5 mb-8" onSubmit={handleInfoSubmit}>
        <h5 className="text-[18px] font-[500] pb-4">Shop Info</h5>
        <label className="block pb-2">Shop Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={`${styles.input} mb-4`} required />

        <label className="block pb-2">Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className={`${styles.input} mb-4`} />

        <label className="block pb-2">Address</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} className={`${styles.input} mb-4`} required />

        <label className="block pb-2">Phone Number</label>
        <input
          type="number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={`${styles.input} mb-4`}
          required
        />

        <label className="block pb-2">Zip Code</label>
        <input
          type="number"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          className={`${styles.input} mb-4`}
          required
        />

        <button type="submit" disabled={updateLoading} className={`${styles.button} !bg-black disabled:opacity-50`}>
          <h5 className="text-white">{updateLoading ? "Saving..." : "Update Shop"}</h5>
        </button>
      </form>

      <div className="w-full 800px:w-[50%] bg-white shadow-sm rounded-md p-5">
        <h5 className="text-[18px] font-[500] pb-4">Payout Method</h5>
        <form onSubmit={handleWithdrawSubmit}>
          <label className="block pb-2">Bank Name</label>
          <input value={bankName} onChange={(e) => setBankName(e.target.value)} className={`${styles.input} mb-4`} required />

          <label className="block pb-2">Account Holder Name</label>
          <input
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            className={`${styles.input} mb-4`}
            required
          />

          <label className="block pb-2">Account Number</label>
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className={`${styles.input} mb-4`}
            required
          />

          <div className="flex gap-3">
            <button type="submit" disabled={updateLoading} className={`${styles.button} !bg-black disabled:opacity-50`}>
              <h5 className="text-white">{updateLoading ? "Saving..." : "Save Payout Method"}</h5>
            </button>
            {seller?.withdrawMethod && (
              <button
                type="button"
                onClick={handleWithdrawDelete}
                disabled={updateLoading}
                className="border border-black h-[50px] px-5 rounded-xl disabled:opacity-50"
              >
                Remove
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
