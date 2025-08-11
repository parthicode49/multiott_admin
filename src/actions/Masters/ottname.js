import { MESSAGE, OTTNAME } from "../../constants/actionTypes";
import * as api from "../../api/index.js";

export const ott_name_create = (formData) => async (dispatch) => {
  try {
    const data = await api.ott_name_create(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const ott_name_update = (formData) => async (dispatch) => {
  try {
    const data = await api.ott_name_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const ott_name_delete = (formData) => async (dispatch) => {
  try {
    const data = await api.ott_name_delete(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const all_ott_name_list = (formData) => async (dispatch) => {
  try {
    const data = await api.all_ott_name_list(formData);
    dispatch({ type: OTTNAME, payload: data?.data });
  } catch (error) {
    console.log(error);
  }
};
