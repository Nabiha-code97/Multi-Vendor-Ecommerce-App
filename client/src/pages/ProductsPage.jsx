import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductCard from "../components/ProductCard/ProductCard";
import { ProductGridSkeleton } from "../components/Skeleton/Skeletons";
import styles from "../styles/styles";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  // isLoading is shared with seller actions, so also require that the list hasn't arrived yet
  const loading = isLoading && !allProducts;

  const data = useMemo(() => {
    if (!allProducts) return [];
    if (categoryData === null) return allProducts;
    return allProducts.filter((i) => i.category === categoryData);
  }, [allProducts, categoryData]);

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {loading ? (
            <ProductGridSkeleton count={10} />
          ) : (
            data.map((i) => <ProductCard data={i} key={i._id} />)
          )}
        </div>
        {!loading && data.length === 0 ? (
          <h1 className="text-center w-full pb-[100px] text-[20px]">
            No products Found!
          </h1>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
