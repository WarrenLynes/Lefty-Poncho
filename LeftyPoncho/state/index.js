import {applyMiddleware, combineReducers, createStore} from "redux";
import AuthReducer from "./auth/reducer";
import thunk from "redux-thunk";
import AppReducer from "./app/reducer";
import GameReducer from "./Game/reducer";
import GameOptionsReducer from "./GameOptions/reducer";

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  game: GameReducer,
  gameOptions: GameOptionsReducer
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);