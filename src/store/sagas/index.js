import { all } from "redux-saga/effects";

import TalentsSaga from "./Talents";
import JobsSaga from "./Jobs";
import MatchingSaga from "./Matching";

export default function* RootSaga() {
  yield all([TalentsSaga(), JobsSaga(), MatchingSaga()]);
}
