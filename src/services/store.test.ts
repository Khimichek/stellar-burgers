import { rootReducer } from './store';
import { configureStore } from '@reduxjs/toolkit';
import { ingredientSlice } from './slices/ingredientSlice';
import { userSlice } from './slices/userSlice';
import { burgerConstructorSlice } from './slices/burgerConstructorSlice';
import { feedSlice } from './slices/feedSlice';
import { orderSlice } from './slices/orderSlice';

const initialRootState = {
  [userSlice.name]: userSlice.getInitialState(),
  [ingredientSlice.name]: ingredientSlice.getInitialState(),
  [burgerConstructorSlice.name]: burgerConstructorSlice.getInitialState(),
  [orderSlice.name]: orderSlice.getInitialState(),
  [feedSlice.name]: feedSlice.getInitialState()
};

describe('rootReducer', () => {
  test('корректное объединение состояний редюсеров', () => {
    const action = { type: 'SOME_ACTION' };
    const state = rootReducer(initialRootState, action);
    expect(state).toEqual(initialRootState);
  });

  test('корректная инициализация начального состояния', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();
    expect(state).toEqual(initialRootState);
  });
});
