import * as api from "../api/index.js";
import { MESSAGE, ADBANNER } from "../constants/actionTypes.js";

export const advertisement_banner_create = (formData) => async (dispatch) => {
  try {
    const data = await api.advertisement_banner_create(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const advertisement_banner_update = (formData) => async (dispatch) => {
  try {
    const data = await api.advertisement_banner_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const advertisement_banner_status_update =
  (formData) => async (dispatch) => {
    try {
      const data = await api.advertisement_banner_status_update(formData);
      dispatch({ type: MESSAGE, payload: data?.data });
      return data;
    } catch (error) {
      dispatch({ type: MESSAGE, payload: error?.response?.data });
      return error?.response?.data;
    }
  };

export const advertisement_banner_delete = (formData) => async (dispatch) => {
  try {
    const data = await api.advertisement_banner_delete(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const all_advertisement_banner_list = (formData) => async (dispatch) => {
  try {
    const { data } = await api.all_advertisement_banner_list(formData);
    dispatch({ type: ADBANNER, payload: data });
  } catch (error) {
    console.log(error);
  }
};
