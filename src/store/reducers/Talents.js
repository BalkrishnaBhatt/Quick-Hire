import * as actionTypes from "store/constants/talents";

let initialState = {
  talents: [],
  activeTalent: {},
  isLoading: true,
  talentCount: 0,
  ResumeCreate: {},
  ResumeUpdate: {},
  afterCreate: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_TALENT_SUCCESS:
      return {
        ...state,
        talents: [...state.talents, action.payload],
      };

    case actionTypes.GET_TALENTS:
      return {
        ...state,
        isLoading: true,
      };

    case actionTypes.SET_TALENTS:
      return {
        ...state,
        isLoading: false,
        talents: action.payload,
      };

    case actionTypes.SET_TALENT_COUNT:
      return {
        ...state,
        talentCount: action.payload.count,
      };

    case actionTypes.SET_ACTIVE_TALENT:
      return {
        ...state,
        activeTalent: action.payload,
      };

    case actionTypes.UPDATE_TALENT_SUCCESS:
      return {
        ...state,
        activeTalent: action.payload,
        talents: [...state.talents].map((item) => {
          if (item.id === action.payload.id) return action.payload;
          return item;
        }),
      };

    case actionTypes.RESUME_CREATE_SUCCESS:
      return {
        ...state,
        ResumeCreate: action.payload,
      };

    case actionTypes.UNSET_RESUME_CREATE:
      return {
        ...state,
        ResumeCreate: {},
      };

    case actionTypes.RESUME_UPDATE_SUCCESS:
      return {
        ...state,
        ResumeUpdate: action.payload,
      };

    case actionTypes.UNSET_RESUME_UPDATE:
      return {
        ...state,
        ResumeUpdate: {},
      };

    case actionTypes.SET_AFTER_CREATE_TALENT:
      return {
        ...state,
        afterCreate: action.payload,
      };

    default:
      return state;
  }
};
