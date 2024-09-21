import {
  burgerConstructorSlice,
  addIngredients,
  moveUpIngredients,
  moveDownIngredients,
  removeIngredient,
  clearConstructor,
  TConstructorIngredientState,
  initialState
} from './burgerConstructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

describe('burgerConstructorSlice', () => {
  const testIngredient: TIngredient = {
    _id: '1',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 50,
    image: 'test-image-url',
    image_mobile: 'test-image-url',
    image_large: 'test-image-url'
  };

  const testConstructorIngredient1: TConstructorIngredient = {
    ...testIngredient,
    id: 'unique-id-1'
  };

  const testConstructorIngredient2: TConstructorIngredient = {
    ...testIngredient,
    id: 'unique-id-2'
  };

  const testBunIngredient: TIngredient = {
    ...testIngredient,
    type: 'bun'
  };

  test('добавление ингредиента в конструктор', () => {
    const action = addIngredients(testIngredient);
    const state = burgerConstructorSlice.reducer(initialState, action);
    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        ...testIngredient,
        id: expect.any(String)
      })
    );
  });

  test('добавление булочки в конструктор', () => {
    const action = addIngredients(testBunIngredient);
    const state = burgerConstructorSlice.reducer(initialState, action);
    expect(state.bun).toEqual(
      expect.objectContaining({
        ...testBunIngredient,
        id: expect.any(String)
      })
    );
  });

  test('удаление ингредиента', () => {
    const preloadedState: TConstructorIngredientState = {
      ...initialState,
      ingredients: [testConstructorIngredient1]
    };
    const action = removeIngredient(testConstructorIngredient1);
    const state = burgerConstructorSlice.reducer(preloadedState, action);
    expect(state.ingredients.length).toBe(0);
  });

  test('перемещение ингредиента вверх', () => {
    const preloadedState: TConstructorIngredientState = {
      ...initialState,
      ingredients: [testConstructorIngredient1, testConstructorIngredient2] // Два ингредиента
    };
    const action = moveUpIngredients(1); // Перемещаем второй ингредиент вверх
    const state = burgerConstructorSlice.reducer(preloadedState, action);
    expect(state.ingredients).toEqual([
      testConstructorIngredient2,
      testConstructorIngredient1
    ]); // Проверяем порядок
  });

  test('перемещение ингредиента вниз', () => {
    const preloadedState: TConstructorIngredientState = {
      ...initialState,
      ingredients: [testConstructorIngredient1, testConstructorIngredient2] // Два ингредиента
    };
    const action = moveDownIngredients(0); // Перемещаем первый ингредиент вниз
    const state = burgerConstructorSlice.reducer(preloadedState, action);
    expect(state.ingredients).toEqual([
      testConstructorIngredient2,
      testConstructorIngredient1
    ]); // Проверяем порядок
  });
});
