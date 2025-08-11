import * as actionType from "../constants/actionTypes";

const offerReducer = (state = { moviesData: null }, action) => {
  switch (action.type) {
    case actionType.OFFER:
      return { ...state, offer_list: action.payload };
    default:
      return state;
  }
};

export default offerReducer;
