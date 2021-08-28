import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import RootReducer from "store/reducers";
import RootSaga from "store/sagas";

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  sagaMiddleware,
  process.env.REACT_APP_ENV === "dev" && logger,
].filter(Boolean);

const store = createStore(RootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(RootSaga);

export default store;
