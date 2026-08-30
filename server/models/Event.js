import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your event name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your event description!"],
  },
  category: {
    type: String,
    required: [true, "Please enter your event category!"],
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your event price!"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter your event stock!"],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  startDate: {
    type: Date,
    required: [true, "Please choose an event start date!"],
  },
  finishDate: {
    type: Date,
    required: [true, "Please choose an event finish date!"],
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
