import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { toast } from "sonner";
import styles from "../../styles/styles";
import { createCoupon, getSellerCoupons, deleteCoupon } from "../../redux/actions/coupon";
import { getAllProductsShop } from "../../redux/actions/product";

const AllCoupons = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { coupons, isLoading, createLoading, error } = useSelector((state) => state.coupons);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    dispatch(getSellerCoupons());
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error]);

  const resetForm = () => {
    setName("");
    setValue("");
    setMinAmount("");
    setMaxAmount("");
    setSelectedProduct("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCoupon({ name, value, minAmount, maxAmount, selectedProduct }))
      .then(() => {
        toast.success("Coupon created!");
        resetForm();
        setOpen(false);
      })
      .catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this coupon?")) {
      dispatch(deleteCoupon(id))
        .then(() => toast.success("Coupon deleted!"))
        .catch(() => {});
    }
  };

  if (isLoading) {
    return <div className="w-full p-8">Loading...</div>;
  }

  return (
    <div className="w-full p-8">
      <div className="flex justify-between items-center pb-4">
        <h3 className="text-[22px] font-[600]">Discount Codes</h3>
        <button onClick={() => setOpen(true)} className={`${styles.button} !bg-black !w-[180px] !h-[40px]`}>
          <h5 className="text-white">Create Coupon</h5>
        </button>
      </div>

      <div className="w-full bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[#00000094]">
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Min Amount</th>
              <th className="p-3">Max Amount</th>
              <th className="p-3">Restricted To</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {coupons && coupons.length === 0 && (
              <tr>
                <td className="p-3" colSpan={6}>
                  You haven't created any coupons yet.
                </td>
              </tr>
            )}
            {coupons &&
              coupons.map((item) => (
                <tr className="border-b" key={item._id}>
                  <td className="p-3 font-[600]">{item.name}</td>
                  <td className="p-3">{item.value}%</td>
                  <td className="p-3">{item.minAmount ?? "-"}</td>
                  <td className="p-3">{item.maxAmount ?? "-"}</td>
                  <td className="p-3">{item.selectedProduct || "All products"}</td>
                  <td className="p-3">
                    <AiOutlineDelete size={20} className="cursor-pointer" onClick={() => handleDelete(item._id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] max-h-[85vh] bg-white rounded-md shadow p-5 overflow-y-scroll">
            <div className="w-full flex justify-end">
              <RxCross1 size={26} className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>
            <h5 className="text-[24px] font-[600] text-center pb-4">Create Coupon Code</h5>
            <form onSubmit={handleSubmit}>
              <label className="block pb-2">
                Code <span className="text-red-500">*</span>
              </label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={`${styles.input} mb-4`} required />

              <label className="block pb-2">
                Discount Percentage <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`${styles.input} mb-4`}
                required
              />

              <label className="block pb-2">Min Order Amount</label>
              <input
                type="number"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                className={`${styles.input} mb-4`}
              />

              <label className="block pb-2">Max Discount Amount</label>
              <input
                type="number"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
                className={`${styles.input} mb-4`}
              />

              <label className="block pb-2">Restrict to a Product (optional)</label>
              <select
                className="w-full mb-4 border h-[40px] rounded-[5px]"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">All products</option>
                {products &&
                  products.map((item) => (
                    <option value={item.name} key={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>

              <button type="submit" disabled={createLoading} className={`${styles.button} !bg-black w-full disabled:opacity-50`}>
                <h5 className="text-white">{createLoading ? "Creating..." : "Create"}</h5>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCoupons;
