import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  ingredientSlice,
  getIngredientsThunk,
  initialState,
  RequestsStatus
} from './ingredientSlice';

// Подмена реализации getIngredientsApi
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientSlice', () => {
  test('начальная проверка', () => {
    const state = ingredientSlice.reducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  test('установка статуса loading при получении ингредиентов', () => {
    const action = getIngredientsThunk.pending('');
    const state = ingredientSlice.reducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Loading);
  });

  test('установка статуса success и данных при успешном получении ингредиентов', () => {
    const testData = [
      {
        _id: '111',
        id: '222',
        name: 'Булка',
        type: 'top',
        proteins: 12,
        fat: 33,
        carbohydrates: 22,
        calories: 33,
        price: 123,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    const action = getIngredientsThunk.fulfilled(testData, '');
    const state = ingredientSlice.reducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Success);
    expect(state.data).toEqual(testData);
  });

  test('установка статуса error при ошибке в получении ингредиентов', () => {
    const action = getIngredientsThunk.rejected(new Error('Ошибка'), '');
    const state = ingredientSlice.reducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Failed);
  });
});
