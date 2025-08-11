import { MESSAGE, SUBOTT } from "../../constants/actionTypes";
import * as api from "../../api/index.js";

export const sub_ott_create = (formData) => async (dispatch) => {
  try {
    const data = await api.sub_ott_create(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};
export const sub_ott_update = (formData) => async (dispatch) => {
  try {
    const data = await api.sub_ott_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};
export const sub_ott_status_update = (formData) => async (dispatch) => {
  try {
    const data = await api.sub_ott_status_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};
export const sub_ott_delete = (formData) => async (dispatch) => {
  try {
    const data = await api.sub_ott_delete(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};
export const all_sub_ott_list = (formData) => async (dispatch) => {
  try {
    const { data } = await api.all_sub_ott_list(formData);
    dispatch({ type: SUBOTT, payload: data });
  } catch (error) {
    console.log(error);
  }
};
