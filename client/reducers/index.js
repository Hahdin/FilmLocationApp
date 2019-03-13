import { combineReducers } from 'redux';
import { filmReducer } from './filmReducer';
const rootReducer = combineReducers({
  filmReducer,
});
export default rootReducer;