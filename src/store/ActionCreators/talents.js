import * as actionTypes from "store/constants/talents";

export const CreateTalentRequest = (payload) => ({
  type: actionTypes.CREATE_TALENT_REQUEST,
  payload,
});

export const CreateTalentSuccess = (payload) => ({
  type: actionTypes.CREATE_TALENT_SUCCESS,
  payload,
});

export const GetTalents = (payload = { page: 0, size: 10 }) => ({
  type: actionTypes.GET_TALENTS,
  payload,
});

export const SetTalents = (payload) => ({
  type: actionTypes.SET_TALENTS,
  payload,
});

export const SetTalentCount = (payload) => ({
  type: actionTypes.SET_TALENT_COUNT,
  payload,
});

export const SetActiveTalent = (payload) => ({
  type: actionTypes.SET_ACTIVE_TALENT,
  payload,
});

export const GetActiveTalent = (payload) => ({
  type: actionTypes.GET_ACTIVE_TALENT,
  payload,
});

export const DeleteActiveTalent = (payload) => ({
  type: actionTypes.DELETE_ACTIVE_TALENT,
  payload,
});

export const UpdateTalentRequest = (payload) => ({
  type: actionTypes.UPDATE_TALENT_REQUEST,
  payload,
});

export const UpdateTalentSuccess = (payload) => ({
  type: actionTypes.UPDATE_TALENT_SUCCESS,
  payload,
});

export const ResumeCreateRequest = (payload) => ({
  type: actionTypes.RESUME_CREATE_REQUEST,
  payload,
});

export const ResumeCreateSuccess = (payload) => ({
  type: actionTypes.RESUME_CREATE_SUCCESS,
  payload,
});

export const UnsetResumeCreate = () => ({
  type: actionTypes.UNSET_RESUME_CREATE,
});

export const ResumeUpdateRequest = (payload) => ({
  type: actionTypes.RESUME_UPDATE_REQUEST,
  payload,
});

export const ResumeUpdateSuccess = (payload) => ({
  type: actionTypes.RESUME_UPDATE_SUCCESS,
  payload,
});

export const UnsetResumeUpdate = () => ({
  type: actionTypes.UNSET_RESUME_UPDATE,
});

export const SetAfterCreateTalent = (payload) => ({
  type: actionTypes.SET_AFTER_CREATE_TALENT,
  payload,
});
