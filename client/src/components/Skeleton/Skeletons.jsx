// A skeleton is a grey placeholder in the same shape as the real card, so the page
// layout doesn't jump when data arrives. `animate-pulse` is Tailwind's built-in fade loop.

export const ProductCardSkeleton = () => {
  return (
    <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 animate-pulse">
      <div className="w-full h-[170px] bg-gray-200 rounded-md" />
      <div className="h-4 w-1/3 bg-gray-200 rounded mt-4" />
      <div className="h-4 w-full bg-gray-200 rounded mt-4" />
      <div className="h-4 w-2/3 bg-gray-200 rounded mt-2" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mt-4" />
      <div className="flex justify-between mt-4">
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
        <div className="h-5 w-1/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

// renders `count` product skeletons — the parent supplies the grid, same as for real cards
export const ProductGridSkeleton = ({ count = 5 }) => {
  return Array.from({ length: count }).map((_, index) => (
    <ProductCardSkeleton key={index} />
  ));
};

export const EventCardSkeleton = () => {
  return (
    <div className="w-full block bg-white rounded-lg mb-12 lg:flex p-2 animate-pulse">
      <div className="w-full lg:w-1/2 h-[300px] bg-gray-200 rounded-md" />
      <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4 p-4">
        <div className="h-7 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-6 w-1/3 bg-gray-200 rounded" />
        <div className="h-8 w-1/2 bg-gray-200 rounded" />
        <div className="flex gap-5">
          <div className="h-[50px] w-[150px] bg-gray-200 rounded-xl" />
          <div className="h-[50px] w-[150px] bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
