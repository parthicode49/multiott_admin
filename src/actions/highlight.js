import {
  MESSAGE,
  HIGHLIGHT
} from "../constants/actionTypes";
import * as api from "../api/index.js";

export const highlight_create = (formData) => async (dispatch) => {
  try {
    const data = await api.highlight_create(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const highlight_update = (formData) => async (dispatch) => {
  try {
    const data = await api.highlight_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const highlight_status_update = (formData) => async (dispatch) => {
  try {
    const data = await api.highlight_status_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const highlight_delete = (formData) => async (dispatch) => {
  try {
    const data = await api.highlight_delete(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const all_highlight_list = (formData) => async (dispatch) => {
  try {
    const {data} = await api.all_highlight_list(formData);
    dispatch({ type: HIGHLIGHT, payload: data });
    return data;
  } catch (error) {
    console.log(error)
  }
};