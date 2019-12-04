import { combineReducers } from 'redux'
import {AppActions, appReducer, AppState} from './app'
export default combineReducers<IReduxStore, IReduxAction>({
  app: appReducer
})

export interface IReduxStore {
  app: AppState;
}

type IReduxAction = AppActions;
