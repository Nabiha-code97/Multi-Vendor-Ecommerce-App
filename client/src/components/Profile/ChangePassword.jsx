import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import styles from "../../styles/styles";
import { updateUserPassword } from "../../redux/actions/user";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { passwordLoading, error } = useSelector((state) => state.user);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password don't match");
      return;
    }

    dispatch(updateUserPassword(oldPassword, newPassword, confirmPassword))
      .then(() => {
        toast.success("Password updated!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch(() => {});
  };

  return (
    <div className="w-full">
      <h3 className="text-[22px] font-[600] pb-4">Change Password</h3>
      <form className="w-full 800px:w-[60%]" onSubmit={handleSubmit}>
        <label className="block pb-2">Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className={`${styles.input} mb-4`}
          required
        />

        <label className="block pb-2">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`${styles.input} mb-4`}
          required
        />

        <label className="block pb-2">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`${styles.input} mb-4`}
          required
        />

        <button type="submit" disabled={passwordLoading} className={`${styles.button} !bg-black disabled:opacity-50`}>
          <h5 className="text-white">{passwordLoading ? "Saving..." : "Update Password"}</h5>
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
