import { call, takeLatest, all, put } from "redux-saga/effects";

// ACTION TYPES
import * as actionTypes from "store/constants/talents";

//ACTION CREATORS
import * as actionCreators from "store/ActionCreators/talents";

//API SERVICES
import * as TalentAPI from "services/Talents";

function* CreateTalentRequest(action) {
  const { resolve, reject, data } = action.payload;

  try {
    let createdTalent = yield call(TalentAPI.CreateTalent, data);
    yield put(actionCreators.CreateTalentSuccess(createdTalent));

    resolve(createdTalent);
  } catch (err) {
    reject(err);
  }
}

function* GetTalents(action) {
  try {
    let talentCount = yield call(TalentAPI.GetTalentsCount, action.payload);
    let talents = yield call(TalentAPI.GetTalents, action.payload);

    yield put(actionCreators.SetTalentCount(talentCount));
    yield put(actionCreators.SetTalents(talents));
  } catch (err) {
    console.log(err);
  }
}

function* GetActiveTalentFlow(action) {
  const { talentId } = action.payload;

  try {
    let activeTalent = yield call(TalentAPI.GetSpecificTalent, talentId);
    yield put(actionCreators.SetActiveTalent(activeTalent));
  } catch (err) {
    console.log(err);
  }
}

function* DeleteActiveTalentFlow(action) {
  const { talentId } = action.payload;

  try {
    yield call(TalentAPI.DeleteTalent, talentId);
  } catch (err) {
    console.log(err);
  }
}

function* UpdateTalentFlow(action) {
  const { data, resolve, reject } = action.payload;
  try {
    let updatedTalent = yield call(TalentAPI.UpdateTalent, data);
    yield put(actionCreators.UpdateTalentSuccess(updatedTalent));
    resolve(updatedTalent);
  } catch (err) {
    console.log(err);
    reject(err);
  }
}

function* ResumeCreateRequestFlow(action) {
  const { resolve, reject, data } = action.payload;
  try {
    let parsedResume = yield call(TalentAPI.UploadResumeToParser, data);
    yield put(actionCreators.ResumeCreateSuccess(parsedResume));
    resolve();
  } catch (err) {
    reject(err);
  }
}

function* ResumeUpdateRequestFlow(action) {
  const { resolve, reject, data } = action.payload;
  try {
    let parsedResume = yield call(TalentAPI.UploadResumeToParser, data);
    yield put(actionCreators.ResumeUpdateSuccess(parsedResume));
    resolve();
  } catch (err) {
    reject(err);
    console.log(err);
  }
}

function* ActionWatcher() {
  yield takeLatest(actionTypes.CREATE_TALENT_REQUEST, CreateTalentRequest);
  yield takeLatest(actionTypes.GET_TALENTS, GetTalents);
  yield takeLatest(actionTypes.GET_ACTIVE_TALENT, GetActiveTalentFlow);
  yield takeLatest(actionTypes.DELETE_ACTIVE_TALENT, DeleteActiveTalentFlow);
  yield takeLatest(actionTypes.UPDATE_TALENT_REQUEST, UpdateTalentFlow);
  yield takeLatest(actionTypes.RESUME_CREATE_REQUEST, ResumeCreateRequestFlow);
  yield takeLatest(actionTypes.RESUME_UPDATE_REQUEST, ResumeUpdateRequestFlow);
}

function* Watcher() {
  yield all([ActionWatcher()]);
}

export default Watcher;
