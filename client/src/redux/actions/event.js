import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// create event — expects a FormData instance (text fields + "images" files)
export const createEvent = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "eventCreateRequest" });
    const { data } = await axios.post(`${BACKEND_URL}/api/event/create-event`, formData, {
      withCredentials: true,
    });
    dispatch({ type: "eventCreateSuccess", payload: data.event });
  } catch (error) {
    dispatch({ type: "eventCreateFail", payload: error.response.data.message });
    throw error;
  }
};

// all events belonging to one shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllEventsShopRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/event/get-all-events-shop/${id}`);
    dispatch({ type: "getAllEventsShopSuccess", payload: data.events });
  } catch (error) {
    dispatch({ type: "getAllEventsShopFailed", payload: error.response.data.message });
  }
};

// delete an event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteEventRequest" });
    const { data } = await axios.delete(`${BACKEND_URL}/api/event/delete-shop-event/${id}`, {
      withCredentials: true,
    });
    dispatch({ type: "deleteEventSuccess", payload: data.message });
  } catch (error) {
    dispatch({ type: "deleteEventFailed", payload: error.response.data.message });
    throw error;
  }
};

// all currently-running events, platform-wide
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllEventsRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/event/get-all-events`);
    dispatch({ type: "getAllEventsSuccess", payload: data.events });
  } catch (error) {
    dispatch({ type: "getAllEventsFailed", payload: error.response.data.message });
  }
};
