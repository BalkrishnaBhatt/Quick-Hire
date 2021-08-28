import * as actionTypes from "store/constants/matching";

let initialState = {
  jobsForMatching: [],
  jobCount: 0,
  matchingActivities: {},
  jobMatchingActivities: {},
  talentCount: 0,
  isLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_JOBS_FOR_MATCHING:
      return {
        ...state,
        jobsForMatching: action.payload,
      };

    case actionTypes.SET_JOBS_FOR_MATCHING_COUNT:
      return {
        ...state,
        jobCount: action.payload,
      };

    case actionTypes.SET_MATCHING_ACTIVITIES:
      return {
        ...state,
        matchingActivities: {
          ...state.matchingActivities,
          [action.payload.id]: action.payload.list,
        },
      };

    case actionTypes.SET_JOB_MATCHING_ACTIVITIES:
      return {
        ...state,
        jobMatchingActivities: {
          ...state.jobMatchingActivities,
          [action.payload.id]: action.payload.list,
        },
      };

    case actionTypes.CREATE_MATCHING_ACTIVITY_SUCCESS:
      return {
        ...state,
        matchingActivities: {
          ...state.matchingActivities,
          [action.payload.matchId]: {},
        },
      };

    case actionTypes.GET_MATCHING_ACTIVITY_DETAILS:
      return {
        ...state,
        matchingActivities: {
          ...state.matchingActivities,
          [action.payload.matchId]: action.payload,
        },
      };

    case actionTypes.GET_MATCHED_TALENTS_SUCCESS:
      const activity = state.matchingActivities[action.payload.matchId]
      return {
        ...state,
        isLoading: false,
        matchingActivities: {
          ...state.matchingActivities,
          [action.payload.matchId]: {...activity, talents: action.payload.talents},
        },
      };
    
    case actionTypes.SET_SEARCHED_MATCHED_TALENTS_COUNT:
      return {
        ...state,
        talentCount: action.payload,
      };

    case actionTypes.GET_SEARCHED_MATCHED_TALENTS:
      return {
        ...state,
        isLoading: true,
      };

    default:
      return state;
  }
};
