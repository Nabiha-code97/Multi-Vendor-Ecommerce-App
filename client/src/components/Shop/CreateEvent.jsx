import React, { useEffect, useMemo, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createEvent } from "../../redux/actions/event";
import { categoriesData } from "../../static/data";

const CreateEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, success, error } = useSelector((state) => state.events);

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
    }
  }, [error, success, submitted]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const imagePreviews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);
  useEffect(() => {
    return () => imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [imagePreviews]);

  // the finish-date input's own min prevents picking an earlier finish date once a
  // start date is chosen, but doesn't stop picking a start date after an existing finish date
  const minFinishDate = startDate || undefined;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !category || !discountPrice || !stock || !startDate || !finishDate || images.length === 0) {
      toast.error("Please fill the complete form and add at least one image");
      return;
    }

    if (new Date(finishDate) <= new Date(startDate)) {
      toast.error("Finish date must be after the start date");
      return;
    }

    const formData = new FormData();
    images.forEach((file) => formData.append("images", file));
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("originalPrice", originalPrice);
    formData.append("discountPrice", discountPrice);
    formData.append("stock", stock);
    formData.append("startDate", startDate);
    formData.append("finishDate", finishDate);

    setSubmitted(true);
    dispatch(createEvent(formData));
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Event</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your event name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            rows="6"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your event description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categoriesData.map((item) => (
              <option value={item.title} key={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your event tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your event price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your event price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Event Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your event stock..."
          />
        </div>
        <br />
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="pb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().slice(0, 10)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="pb-2">
              Finish Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={finishDate}
              min={minFinishDate}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setFinishDate(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="event-upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="event-upload">
              <AiOutlinePlusCircle size={30} className="mt-3 cursor-pointer" color="#555" />
            </label>
            {imagePreviews.map((url, index) => (
              <img src={url} key={index} alt="" className="h-[120px] w-[120px] object-cover m-2" />
            ))}
          </div>
          <br />
          <div>
            <input
              type="submit"
              value={isLoading ? "Creating..." : "Create"}
              disabled={isLoading}
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
