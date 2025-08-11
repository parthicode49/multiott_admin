import * as actionType from "../constants/actionTypes";

const adBannerReducer = (state = { advertisementData: null }, action) => {
  switch (action.type) {
    case actionType.ADBANNER:
      return { ...state, ad_banner: action.payload };

    default:
      return state;
  }
};

export default adBannerReducer;
