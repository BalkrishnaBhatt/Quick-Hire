import * as actionTypes from "store/constants/jobs";

export const GetJobs = (payload) => ({
  type: actionTypes.GET_JOBS,
  payload,
});

export const SetJobs = (payload) => ({
  type: actionTypes.SET_JOBS,
  payload,
});

export const SetJobCount = (payload) => ({
  type: actionTypes.SET_JOB_COUNT,
  payload,
});

export const GetActiveJob = (payload) => ({
  type: actionTypes.GET_ACTIVE_JOB,
  payload,
});

export const SetActiveJob = (payload) => ({
  type: actionTypes.SET_ACTIVE_JOB,
  payload,
});

export const DeleteActiveJob = (payload) => ({
  type: actionTypes.DELETE_ACTIVE_JOB,
  payload,
});

export const CreateJobRequest = (payload) => ({
  type: actionTypes.CREATE_JOB_REQUEST,
  payload,
});

export const CreateJobSuccess = (payload) => ({
  type: actionTypes.CREATE_JOB_SUCCESS,
  payload,
});

export const UpdateJobRequest = (payload) => ({
  type: actionTypes.UPDATE_JOB_REQUEST,
  payload,
});

export const UpdateJobSuccess = (payload) => ({
  type: actionTypes.UPDATE_JOB_SUCCESS,
  payload,
});

export const JDCreateRequest = (payload) => ({
  type: actionTypes.JD_CREATE_REQUEST,
  payload,
});

export const JDCreateSuccess = (payload) => ({
  type: actionTypes.JD_CREATE_SUCCESS,
  payload,
});

export const UnsetJDCreate = () => ({
  type: actionTypes.UNSET_JD_CREATE,
});

export const JDUpdateRequest = (payload) => ({
  type: actionTypes.JD_UPDATE_REQUEST,
  payload,
});

export const JDUpdateSuccess = (payload) => ({
  type: actionTypes.JD_UPDATE_SUCCESS,
  payload,
});

export const UnsetJDUpdate = () => ({
  type: actionTypes.UNSET_JD_UPDATE,
});

export const SetAfterCreateJob = (payload) => ({
  type: actionTypes.SET_AFTER_CREATE_JOB,
  payload,
});
