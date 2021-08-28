import { combineReducers } from "redux";

import TalentsReducer from "./Talents";
import JobsReducer from "./Jobs";
import MatchingReducer from "./Matching";

const rootReducer = combineReducers({
  talents: TalentsReducer,
  jobs: JobsReducer,
  matching: MatchingReducer,
});

export default rootReducer;
