import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getAllWithdrawsAdmin, updateWithdrawStatus } from "../../redux/actions/withdraw";

const statusColors = {
  Processing: "bg-yellow-100 text-yellow-700",
  Succeeded: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
};

const AllWithdraws = () => {
  const dispatch = useDispatch();
  const { adminWithdraws, adminLoading, updateLoading, error } = useSelector((state) => state.withdraws);

  useEffect(() => {
    dispatch(getAllWithdrawsAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error]);

  const handleUpdate = (id, status) => {
    dispatch(updateWithdrawStatus(id, status)).catch(() => {});
  };

  if (adminLoading) {
    return <div className="w-full p-8">Loading...</div>;
  }

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">Withdraw Requests</h3>
      <div className="w-full bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[#00000094]">
              <th className="p-3">Shop</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Requested</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {adminWithdraws && adminWithdraws.length === 0 && (
              <tr>
                <td className="p-3" colSpan={5}>
                  No withdraw requests yet.
                </td>
              </tr>
            )}
            {adminWithdraws &&
              adminWithdraws.map((item) => (
                <tr className="border-b" key={item._id}>
                  <td className="p-3">#{item.shopId?.toString().slice(-8)}</td>
                  <td className="p-3">${item.amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[13px] ${statusColors[item.status] || ""}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    {item.status === "Processing" && (
                      <div className="flex gap-3">
                        <button
                          disabled={updateLoading}
                          onClick={() => handleUpdate(item._id, "Succeeded")}
                          className="text-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={updateLoading}
                          onClick={() => handleUpdate(item._id, "Rejected")}
                          className="text-red-600 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllWithdraws;
