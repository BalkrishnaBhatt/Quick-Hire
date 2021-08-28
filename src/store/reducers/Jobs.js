import * as actionTypes from "store/constants/jobs";

let initialState = {
  list: [],
  activeJob: {},
  isLoading: true,
  jobCount: 0,
  JDCreate: {},
  JDUpdate: {},
  afterCreate: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_JOBS:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.SET_JOBS:
      return {
        ...state,
        isLoading: false,
        list: action.payload,
      };

    case actionTypes.SET_JOB_COUNT:
      return {
        ...state,
        jobCount: action.payload,
      };

    case actionTypes.SET_ACTIVE_JOB:
      return {
        ...state,
        activeJob: action.payload,
      };

    case actionTypes.CREATE_JOB_SUCCESS:
      return {
        ...state,
        activeJob: action.payload,
        list: [...state.list, action.payload],
      };

    case actionTypes.UPDATE_JOB_SUCCESS:
      return {
        ...state,
        activeJob: action.payload,
        list: [...state.list].map((item) => {
          if (item.id === action.payload.id) return action.payload;
          return item;
        }),
      };

    case actionTypes.JD_CREATE_SUCCESS:
      return {
        ...state,
        JDCreate: action.payload,
      };

    case actionTypes.UNSET_JD_CREATE:
      return {
        ...state,
        JDCreate: {},
      };

    case actionTypes.JD_UPDATE_SUCCESS:
      return {
        ...state,
        JDUpdate: action.payload,
      };

    case actionTypes.UNSET_JD_UPDATE:
      return {
        ...state,
        JDUpdate: {},
      };

    case actionTypes.SET_AFTER_CREATE_JOB:
      return {
        ...state,
        afterCreate: action.payload,
      };

    default:
      return state;
  }
};
