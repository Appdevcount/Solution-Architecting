/* istanbul ignore file */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authSlice';
import requestReducer, { restrcitedReducer }  from '../reducers/requestSlice';
import { loadState, saveState } from '../../utils/authtokenhandler';



const preloadedState =  loadState();

const rootReducer=combineReducers({
  auth: authReducer,
  request:requestReducer,
  restricted : restrcitedReducer
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState
});

store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
