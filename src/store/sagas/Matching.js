import { call, takeLatest, all, put } from "redux-saga/effects";

import * as actionTypes from "store/constants/matching";
import * as actionCreators from "store/ActionCreators/matching";

import * as MatchingAPI from "services/Matching";

function* GetJobsForMatchingFlow(action) {
  try {   
    let jobs = yield call(MatchingAPI.GetJobsForMatching, action.payload);
    yield put(actionCreators.SetJobsForMatching(jobs));

    let jobCount = yield call(MatchingAPI.GetJobsForMatchingCount, action.payload);
    yield put(actionCreators.SetJobsForMatchingCount(jobCount));
    
  } catch (err) {
    console.log(err);
  }
}

function* GetMatchingActivitiesFlow(action) {
  const { jobId } = action.payload;

  try {
    const { count } = yield call(MatchingAPI.GetMatchingActivitiesCount, jobId);

    const matchingActivities = yield call(MatchingAPI.GetMatchingActivities, {
      jobId,
      page: 0,
      size: count,
    });

    yield put(
      actionCreators.SetJobMatchingActivities({
        id: jobId,
        list: matchingActivities,
      })
    );
  } catch (err) {
    console.log(err);
  }
}

function* AddMatchActivityFlow(action) {
  const { resolve, reject, jobId, criteria } = action.payload;
  try {
    let createActivity = yield call(MatchingAPI.CreateMatch, {jobId, criteria});
    yield put(actionCreators.CreateMatchingActivitySuccess(createActivity));
    
    let details = yield call(MatchingAPI.GetMatchingActivityDetails, createActivity.matchId);
    details.currentJob = criteria.currentJob
    details.status = criteria.status

    yield put(actionCreators.GetMatchingActivityDetails(details));
    
    resolve(details);
  } catch (err) {
    reject(err);
    console.log(err);
  }
}

function* UpdateMatchActivityFlow(action) {
  const { resolve, reject, matchId, currentJob, status } = action.payload;
  try {
    let details = yield call(MatchingAPI.GetMatchingActivityDetails, matchId);
    details.currentJob = currentJob

    if(details.finishTime > 0) {
      details.status = 'done'
    } else {
      details.status = status
    }

    yield put(actionCreators.GetMatchingActivityDetails(details));
    resolve(details);
  } catch (err) {
    reject(err);
    console.log(err);
  }
}

function* GetMatchedTalentsFlow(action) {
  const { resolve, reject, matchId, page, size } = action.payload;
  try {
    let talents = yield call(MatchingAPI.GetMatchedTalents, {matchId, page, size });
    yield put(actionCreators.GetMatchedTalentsSuccess({matchId, talents}));
    resolve(talents);
  } catch (err) {
    reject(err);
    console.log(err);
  }
}

function* GetSearchedMatchedTalents(action) {
  const { resolve, reject, matchId, page, size, keyword } = action.payload;

  try {
    let talents = yield call(MatchingAPI.GetSearchedMatchedTalents, { matchId, page, size, keyword });
    yield put(actionCreators.GetMatchedTalentsSuccess({matchId, talents}));

    let talentCount = yield call(MatchingAPI.GetSearchedMatchedTalentsCount, { matchId, keyword })
    yield put(actionCreators.SetSearchedMatchedTalentsCount(talentCount))

    resolve({talents, talentCount})
  } catch (error) {
    reject(error);
    console.log(error);
  }
}

function* ActionWatcher() {
  yield takeLatest(
    actionTypes.GET_MATCHING_ACTIVITIES,
    GetMatchingActivitiesFlow
  );
  yield takeLatest(
    actionTypes.CREATE_MATCHING_ACTIVITY_REQUEST,
    AddMatchActivityFlow
  );
  yield takeLatest(
    actionTypes.UPDATE_MATCHING_ACTIVITY_DETAILS,
    UpdateMatchActivityFlow
  );
  yield takeLatest(
    actionTypes.GET_MATCHED_TALENTS_REQUEST,
    GetMatchedTalentsFlow
  );
  yield takeLatest(
    actionTypes.GET_JOBS_FOR_MATCHING,
    GetJobsForMatchingFlow
  );
  yield takeLatest(
    actionTypes.GET_SEARCHED_MATCHED_TALENTS,
    GetSearchedMatchedTalents
  );
}

function* Watcher() {
  yield all([ActionWatcher()]);
}

export default Watcher;
