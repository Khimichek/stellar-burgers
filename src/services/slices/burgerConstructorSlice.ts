import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

import { v4 as uuidv4 } from 'uuid'; // Генератор id для ингредиента или заказа

type TConstructorIngredientState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorIngredientState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4(); // Генератор id для ингредиента
        return { payload: { ...ingredient, id } };
      }
    },
    // Перемещение ингредиента вверх
    moveUpIngredients: (state, action: PayloadAction<number>) => {
      // Используем деструктуризацию const [a, b] = [b, a]
      [
        state.ingredients[action.payload],
        state.ingredients[action.payload - 1]
      ] = [
        state.ingredients[action.payload - 1],
        state.ingredients[action.payload]
      ];
    },
    // Перемещение ингредиента вниз
    moveDownIngredients: (state, action: PayloadAction<number>) => {
      [
        state.ingredients[action.payload],
        state.ingredients[action.payload + 1]
      ] = [
        state.ingredients[action.payload + 1],
        state.ingredients[action.payload]
      ];
    },
    // Удаление ингредиента
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    },
    // Очистка конструктора после оформления заказа
    clearConstructor: (state: TConstructorIngredientState) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectBurgerConstructor: (state) => state
  }
});

export const { selectBurgerConstructor } = burgerConstructorSlice.selectors;

export const {
  addIngredients,
  moveUpIngredients,
  moveDownIngredients,
  removeIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
