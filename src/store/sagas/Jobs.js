import { call, takeLatest, all, put } from "redux-saga/effects";

import * as actionTypes from "store/constants/jobs";
import * as actionCreators from "store/ActionCreators/jobs";
import * as JobsAPI from "services/Jobs";

function* GetJobsFlow(action) {
  try {   
    let jobs = yield call(JobsAPI.GetJobs, action.payload);
    yield put(actionCreators.SetJobs(jobs));

    if(!action.payload.noCount) { 
      let jobCount = yield call(JobsAPI.GetJobsCount, action.payload);
      yield put(actionCreators.SetJobCount(jobCount.count));
    }
  } catch (err) {
    console.log(err);
  }
}

function* GetActiveJobFlow(action) {
  const { jobId } = action.payload;
  try {
    let activeJob = yield call(JobsAPI.GetSpecificJob, jobId);

    yield put(actionCreators.SetActiveJob(activeJob));
  } catch (err) {
    console.log(err);
  }
}

function* DeleteActiveJobFlow(action) {
  const { jobId } = action.payload;
  try {
    let activeJob = yield call(JobsAPI.DeleteJob, jobId);
  } catch (err) {
    console.log(err);
  }
}

function* CreateJobFlow(action) {
  const { resolve, reject, data } = action.payload;
  try {
    let createJob = yield call(JobsAPI.CreateJob, data);
    yield put(actionCreators.CreateJobSuccess(createJob));
    resolve(createJob);
  } catch (err) {
    reject(err);
    console.log(err);
  }
}

function* UpdateJobFlow(action) {
  const { resolve, reject, data } = action.payload;
  try {
    let updatedJob = yield call(JobsAPI.UpdateJob, data);
    console.log(updatedJob);
    yield put(actionCreators.UpdateJobSuccess(updatedJob));
    resolve(updatedJob);
  } catch (err) {
    reject(err);
  }
}

function* JDCreateFlow(action) {
  const { resolve, reject, data } = action.payload;
  try {
    let parsedJD = yield call(JobsAPI.UploadJDToParser, data);
    yield put(actionCreators.JDCreateSuccess(parsedJD));
    resolve();
  } catch (err) {
    reject(err);
  }
}

function* JDUpdateFlow(action) {
  const { resolve, reject, data } = action.payload;
  try {
    let parsedJD = yield call(JobsAPI.UploadJDToParser, data);
    yield put(actionCreators.JDUpdateSuccess(parsedJD));
    resolve();
  } catch (err) {
    reject(err);
  }
}

function* ActionWatcher() {
  yield takeLatest(actionTypes.GET_JOBS, GetJobsFlow);
  yield takeLatest(actionTypes.GET_ACTIVE_JOB, GetActiveJobFlow);
  yield takeLatest(actionTypes.DELETE_ACTIVE_JOB, DeleteActiveJobFlow);
  yield takeLatest(actionTypes.CREATE_JOB_REQUEST, CreateJobFlow);
  yield takeLatest(actionTypes.UPDATE_JOB_REQUEST, UpdateJobFlow);
  yield takeLatest(actionTypes.JD_CREATE_REQUEST, JDCreateFlow);
  yield takeLatest(actionTypes.JD_UPDATE_REQUEST, JDUpdateFlow);
}

function* Watcher() {
  yield all([ActionWatcher()]);
}

export default Watcher;
