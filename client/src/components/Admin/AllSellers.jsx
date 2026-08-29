import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "sonner";
import { getAllSellersAdmin, deleteSeller } from "../../redux/actions/seller";

const AllSellers = () => {
  const dispatch = useDispatch();
  const { sellers, sellersLoading, error } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllSellersAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this seller and their shop? This cannot be undone.")) {
      dispatch(deleteSeller(id)).catch(() => {});
    }
  };

  if (sellersLoading) {
    return <div className="w-full p-8">Loading...</div>;
  }

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">All Sellers</h3>
      <div className="w-full bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[#00000094]">
              <th className="p-3">Shop</th>
              <th className="p-3">Email</th>
              <th className="p-3">Address</th>
              <th className="p-3">Joined</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sellers && sellers.length === 0 && (
              <tr>
                <td className="p-3" colSpan={5}>
                  No sellers yet.
                </td>
              </tr>
            )}
            {sellers &&
              sellers.map((seller) => (
                <tr className="border-b" key={seller._id}>
                  <td className="p-3">{seller.name}</td>
                  <td className="p-3">{seller.email}</td>
                  <td className="p-3">{seller.address}</td>
                  <td className="p-3">{new Date(seller.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <AiOutlineDelete
                      size={20}
                      className="cursor-pointer"
                      onClick={() => handleDelete(seller._id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSellers;
