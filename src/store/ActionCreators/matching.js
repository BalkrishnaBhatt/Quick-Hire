import * as actionTypes from "store/constants/matching";

export const GetJobsForMatching = (payload) => ({
  type: actionTypes.GET_JOBS_FOR_MATCHING,
  payload,
});

export const SetJobsForMatching = (payload) => ({
  type: actionTypes.SET_JOBS_FOR_MATCHING,
  payload,
});

export const SetJobsForMatchingCount = (payload) => ({
  type: actionTypes.SET_JOBS_FOR_MATCHING_COUNT,
  payload,
});

export const GetMatchingActivities = (payload) => ({
  type: actionTypes.GET_MATCHING_ACTIVITIES,
  payload,
});

export const SetMatchingActivities = (payload) => ({
  type: actionTypes.SET_MATCHING_ACTIVITIES,
  payload,
});

export const SetJobMatchingActivities = (payload) => ({
  type: actionTypes.SET_JOB_MATCHING_ACTIVITIES,
  payload,
});

export const CreateMatchingActivityRequest = (payload) => ({
  type: actionTypes.CREATE_MATCHING_ACTIVITY_REQUEST,
  payload,
});

export const CreateMatchingActivitySuccess = (payload) => ({
  type: actionTypes.CREATE_MATCHING_ACTIVITY_SUCCESS,
  payload,
});

export const GetMatchingActivityDetails = (payload) => ({
  type: actionTypes.GET_MATCHING_ACTIVITY_DETAILS,
  payload,
});

export const UpdateMatchingActivityDetails = (payload) => ({
  type: actionTypes.UPDATE_MATCHING_ACTIVITY_DETAILS,
  payload,
});

export const GetMatchedTalentsRequest = (payload) => ({
  type: actionTypes.GET_MATCHED_TALENTS_REQUEST,
  payload,
});

export const GetMatchedTalentsSuccess = (payload) => ({
  type: actionTypes.GET_MATCHED_TALENTS_SUCCESS,
  payload,
});

export const SetSearchedMatchedTalentsCount = (payload) => ({
  type: actionTypes.SET_SEARCHED_MATCHED_TALENTS_COUNT,
  payload,
});

export const GetSearchedMatchedTalents = (payload) => ({
  type: actionTypes.GET_SEARCHED_MATCHED_TALENTS,
  payload,
});