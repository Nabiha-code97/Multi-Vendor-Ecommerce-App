import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import styles from "../../styles/styles";
import { createWithdrawRequest, getSellerWithdraws } from "../../redux/actions/withdraw";
import { loadSeller } from "../../redux/actions/user";

const statusColors = {
  Processing: "bg-yellow-100 text-yellow-700",
  Succeeded: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
};

const WithdrawMoney = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { withdraws, isLoading, createLoading, error } = useSelector((state) => state.withdraws);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    dispatch(getSellerWithdraws());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (numericAmount > seller.availableBalance) {
      toast.error("You don't have enough balance to withdraw that much");
      return;
    }

    dispatch(createWithdrawRequest(numericAmount))
      .then(() => {
        toast.success("Withdraw request submitted!");
        setAmount("");
        dispatch(loadSeller()); // refresh availableBalance now that the backend has deducted it
      })
      .catch(() => {});
  };

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">Withdraw Money</h3>

      <div className="w-full bg-white shadow-sm rounded-md p-5 mb-6">
        <h5 className="text-[16px] text-[#00000094]">Available Balance</h5>
        <h4 className="text-[28px] font-[600] pt-2 pb-4">${seller?.availableBalance?.toFixed(2) ?? "0.00"}</h4>

        {!seller?.withdrawMethod ? (
          <p className="text-[#00000094]">
            You need a payout method before you can withdraw.{" "}
            <Link to="/dashboard-settings" className="text-[#077f9c]">
              Add one in Settings
            </Link>
            .
          </p>
        ) : (
          <form className="flex items-center gap-3" onSubmit={handleSubmit}>
            <input
              type="number"
              placeholder="Amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`${styles.input} !w-[150px]`}
            />
            <button type="submit" disabled={createLoading} className={`${styles.button} !bg-black disabled:opacity-50`}>
              <h5 className="text-white">{createLoading ? "Submitting..." : "Withdraw"}</h5>
            </button>
          </form>
        )}
      </div>

      <h3 className="text-[18px] font-[600] pb-3">Withdraw History</h3>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full bg-white shadow-sm rounded-md overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-[#00000094]">
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Requested</th>
              </tr>
            </thead>
            <tbody>
              {withdraws && withdraws.length === 0 && (
                <tr>
                  <td className="p-3" colSpan={3}>
                    No withdraw requests yet.
                  </td>
                </tr>
              )}
              {withdraws &&
                withdraws.map((item) => (
                  <tr className="border-b" key={item._id}>
                    <td className="p-3">${item.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-[13px] ${statusColors[item.status] || ""}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
