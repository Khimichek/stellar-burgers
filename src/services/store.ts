import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userSlice } from './slices/userSlice';
import { ingredientSlice } from './slices/ingredientSlice';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { orderSlice } from './slices/orderSlice';
import { feedSlice } from './slices/feedSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [ingredientSlice.name]: ingredientSlice.reducer,
  [burgerConstructorSlice.name]: burgerConstructorSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [feedSlice.name]: feedSlice.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
