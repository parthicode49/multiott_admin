import {
  MESSAGE,
  OFFER
} from "../constants/actionTypes";
import * as api from "../api/index.js";

export const offer_create = (formData) => async (dispatch) => {
  try {
    const data = await api.offer_create(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const offer_update = (formData) => async (dispatch) => {
  try {
    const data = await api.offer_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const offer_status_update = (formData) => async (dispatch) => {
  try {
    const data = await api.offer_status_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const offer_delete = (formData) => async (dispatch) => {
  try {
    const data = await api.offer_delete(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const offer_list_admin = (formData) => async (dispatch) => {
  try {
    const {data}= await api.offer_list_admin(formData);
    dispatch({ type: OFFER, payload: data });
    return data;
  } catch (error) {
    console.log(error)
  }
};