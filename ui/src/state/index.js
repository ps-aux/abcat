import { combineReducers, createStore as _createStore } from 'redux'
import statsReducer from '../stats/reducer'

const devTools = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

export const createStore = () =>
  _createStore(combineReducers({
    stats: statsReducer
  }), devTools)
