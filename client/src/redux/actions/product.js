import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// create product — expects a FormData instance (text fields + "images" files)
export const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });
    const { data } = await axios.post(
      `${BACKEND_URL}/api/product/create-product`,
      formData,
      { withCredentials: true }
    );
    dispatch({ type: "productCreateSuccess", payload: data.product });
  } catch (error) {
    dispatch({ type: "productCreateFail", payload: error.response.data.message });
  }
};

// all products belonging to one shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsShopRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/product/get-all-products-shop/${id}`);
    dispatch({ type: "getAllProductsShopSuccess", payload: data.products });
  } catch (error) {
    dispatch({ type: "getAllProductsShopFailed", payload: error.response.data.message });
  }
};

// delete a product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });
    const { data } = await axios.delete(
      `${BACKEND_URL}/api/product/delete-shop-product/${id}`,
      { withCredentials: true }
    );
    dispatch({ type: "deleteProductSuccess", payload: data.message });
  } catch (error) {
    dispatch({ type: "deleteProductFailed", payload: error.response.data.message });
  }
};

// all products, platform-wide
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/product/get-all-products`);
    dispatch({ type: "getAllProductsSuccess", payload: data.products });
  } catch (error) {
    dispatch({ type: "getAllProductsFailed", payload: error.response.data.message });
  }
};
