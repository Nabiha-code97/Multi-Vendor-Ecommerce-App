import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsAdmin } from "../../redux/actions/product";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { adminProducts, adminProductsLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllProductsAdmin());
  }, [dispatch]);

  if (adminProductsLoading) {
    return <div className="w-full p-8">Loading...</div>;
  }

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">All Products</h3>
      <div className="w-full bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[#00000094]">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Shop</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Sold</th>
            </tr>
          </thead>
          <tbody>
            {adminProducts && adminProducts.length === 0 && (
              <tr>
                <td className="p-3" colSpan={6}>
                  No products yet.
                </td>
              </tr>
            )}
            {adminProducts &&
              adminProducts.map((item) => (
                <tr className="border-b" key={item._id}>
                  <td className="p-3">
                    <img
                      src={item.images?.[0]?.url}
                      alt=""
                      className="w-[50px] h-[50px] rounded object-cover"
                    />
                  </td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.shop?.name}</td>
                  <td className="p-3">US$ {item.discountPrice}</td>
                  <td className="p-3">{item.stock}</td>
                  <td className="p-3">{item.sold_out ?? 0}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProducts;
