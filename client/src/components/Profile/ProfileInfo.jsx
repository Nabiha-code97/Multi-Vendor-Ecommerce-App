import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "sonner";
import styles from "../../styles/styles";
import { updateUserInformation, updateUserAvatar } from "../../redux/actions/user";

const ProfileInfo = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

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
    dispatch(updateUserAvatar(formData))
      .then(() => toast.success("Avatar updated!"))
      .catch(() => {});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password))
      .then(() => {
        toast.success("Profile updated!");
        setPassword("");
      })
      .catch(() => {});
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-center mb-6">
        <div className="relative">
          <img
            src={avatarPreview || user?.avatar?.url}
            alt=""
            className="w-[150px] h-[150px] rounded-full object-cover"
          />
          <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
            <input type="file" id="user-avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            <label htmlFor="user-avatar-upload">
              <AiOutlineCamera />
            </label>
          </div>
        </div>
      </div>

      <form className="w-full 800px:w-[60%] mx-auto" onSubmit={handleSubmit}>
        <label className="block pb-2">Full Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={`${styles.input} mb-4`} required />

        <label className="block pb-2">Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${styles.input} mb-4`} required />

        <label className="block pb-2">Phone Number</label>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className={`${styles.input} mb-4`}
        />

        <label className="block pb-2">Current Password (required to save changes)</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${styles.input} mb-4`}
          required
        />

        <button type="submit" disabled={loading} className={`${styles.button} !bg-black disabled:opacity-50`}>
          <h5 className="text-white">{loading ? "Saving..." : "Update Profile"}</h5>
        </button>
      </form>
    </div>
  );
};

export default ProfileInfo;
