import {
  MESSAGE,
  PSSLIDER_BANNERS,
  SLIDER_BANNERS,

} from "../constants/actionTypes";
import * as api from "../api/index.js";

export const play_store_sliderbanner_create = (formData) => async (dispatch) => {
  try {
    const data = await api.play_store_sliderbanner_create(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};

export const play_store_sliderbanner_update = (formData) => async (dispatch) => {
  try {
    const data = await api.play_store_sliderbanner_update(formData);
    dispatch({ type: MESSAGE, payload: data?.data });
    return data;
  } catch (error) {
    dispatch({ type: MESSAGE, payload: error?.response?.data });
    return error?.response?.data;
  }
};
export const play_store_slide_banner_status_update = (formData) => async (dispatch) => {
  try {
    const { data } = await api.play_store_slide_banner_status_update(formData);
    dispatch({ type: MESSAGE, payload: data });
  } catch (error) {
    console.log(error);
  }
};
export const play_store_sliderbanner_delete = (formData) => async (dispatch) => {
  try {
    const { data } = await api.play_store_sliderbanner_delete(formData);
    dispatch({ type: MESSAGE, payload: data });
  } catch (error) {
    console.log(error);
  }
};
export const play_store_all_sliderbanner_list = (formData) => async (dispatch) => {
  try {
    const { data } = await api.play_store_all_sliderbanner_list(formData);

    dispatch({ type: PSSLIDER_BANNERS, payload: data });
  } catch (error) {
    console.log(error);
  }
};
