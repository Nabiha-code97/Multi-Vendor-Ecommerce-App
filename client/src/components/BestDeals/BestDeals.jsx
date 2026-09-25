import { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { ProductGridSkeleton } from "../Skeleton/Skeletons";

const BestDeals = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  // isLoading is shared with seller actions, so also require that the list hasn't arrived yet
  const loading = isLoading && !allProducts;

  // derived from allProducts during render — no state/effect needed.
  // copy before sorting: .sort() mutates in place, and allProducts is frozen Redux state
  const data = useMemo(
    () => [...(allProducts ?? [])].sort((a, b) => b.sold_out - a.sold_out).slice(0, 5),
    [allProducts]
  );


  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
           {loading && <ProductGridSkeleton count={5} />}
           {!loading && data.map((i) => <ProductCard data={i} key={i._id} />)}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;