import React from "react";
import styles from "../../styles/styles";

// styled text wordmarks instead of hotlinked logo images — two of the five (LG, Apple)
// were pointing at dead/hotlink-blocked third-party URLs, matching the same failure
// pattern already fixed for the category icons. Plain styled text has no network
// dependency, so it can't ever go blank again.
const brands = [
  { name: "SONY", className: "font-serif italic font-bold text-black text-[28px] tracking-wide" },
  { name: "DELL", className: "font-sans font-extrabold text-[#007DB8] text-[28px] tracking-tight" },
  { name: "LG", className: "font-sans font-extrabold text-[#A50034] text-[32px]" },
  { name: "Apple", className: "font-sans font-semibold text-[#333] text-[28px]" },
  { name: "Microsoft", className: "font-sans font-semibold text-[#5E5E5E] text-[24px]" },
];

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}
    >
      <div className="flex justify-between items-center w-full">
        {brands.map((brand) => (
          <div className="flex items-start" key={brand.name}>
            <span className={brand.className}>{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsored;
