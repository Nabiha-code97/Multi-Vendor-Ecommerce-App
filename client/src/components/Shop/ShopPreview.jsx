import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import Loader from "../Layout/Loader";
import ProductCard from "../ProductCard/ProductCard";
import styles from "../../styles/styles";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const ShopPreview = () => {
  const { id } = useParams();
  const { allProducts } = useSelector((state) => state.products);
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/shop/get-shop-info/${id}`)
      .then(({ data }) => {
        setShop(data.shop);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Shop not found");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const shopProducts =
    allProducts && allProducts.filter((product) => product.shop._id === id);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !shop) {
    return (
      <div>
        <Header />
        <h1 className="text-center w-full pb-[100px] pt-[50px] text-[20px]">
          {error || "Shop not found"}
        </h1>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className={`${styles.section} py-8`}>
        <div className="flex items-center">
          <img
            src={`${shop.avatar?.url}`}
            alt=""
            className="w-[100px] h-[100px] rounded-full mr-4 object-cover"
          />
          <div>
            <h1 className={`${styles.productTitle}`}>{shop.name}</h1>
            <p className="text-[15px] text-[#555] pt-2">
              Joined on {new Date(shop.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {shop.description && (
          <p className="pt-6 text-[16px] text-[#333] leading-7">
            {shop.description}
          </p>
        )}
        {shop.address && (
          <p className="pt-4 text-[15px] text-[#555]">Address: {shop.address}</p>
        )}

        <h2 className={`${styles.productTitle} pt-10 pb-4`}>
          Shop Products
        </h2>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {shopProducts &&
            shopProducts.map((product, index) => (
              <ProductCard data={product} key={index} />
            ))}
        </div>
        {shopProducts && shopProducts.length === 0 && (
          <h1 className="text-center w-full pb-[50px] text-[18px]">
            This shop has no products yet!
          </h1>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShopPreview;
