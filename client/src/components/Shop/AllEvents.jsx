import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { toast } from "sonner";
import { getAllEventsShop, deleteEvent } from "../../redux/actions/event";

const AllEvents = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { events, isLoading, message } = useSelector((state) => state.events);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(getAllEventsShop(seller._id));
      dispatch({ type: "clearMessages" });
    }
  }, [message]);

  const handleDelete = (id) => {
    if (window.confirm("Delete this event? This cannot be undone.")) {
      dispatch(deleteEvent(id)).catch(() => {});
    }
  };

  if (isLoading) {
    return <div className="w-full p-8">Loading...</div>;
  }

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">All Events</h3>
      <div className="w-full bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[#00000094]">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Finishes</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {events && events.length === 0 && (
              <tr>
                <td className="p-3" colSpan={6}>
                  You haven't created any events yet.
                </td>
              </tr>
            )}
            {events &&
              events.map((item) => {
                const expired = new Date(item.finishDate) <= new Date();
                return (
                  <tr className="border-b" key={item._id}>
                    <td className="p-3">
                      <img
                        src={item.images?.[0]?.url}
                        alt=""
                        className="w-[50px] h-[50px] rounded object-cover"
                      />
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">US$ {item.discountPrice}</td>
                    <td className="p-3">{item.stock}</td>
                    <td className="p-3">
                      {expired ? (
                        <span className="text-red-600">Expired</span>
                      ) : (
                        new Date(item.finishDate).toLocaleDateString()
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/product/${item._id}?isEvent=true`}>
                          <AiOutlineEye size={20} className="cursor-pointer" />
                        </Link>
                        <AiOutlineDelete
                          size={20}
                          className="cursor-pointer"
                          onClick={() => handleDelete(item._id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEvents;
