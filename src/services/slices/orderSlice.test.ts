import { configureStore, Store } from '@reduxjs/toolkit';
import orderReducer, {
  initialState,
  OrderThunk,
  clearOrder
} from './orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  const store: Store<{ order: typeof initialState }> = configureStore({
    reducer: { order: orderReducer }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('возврат исходного состояния', () => {
    const state = store.getState().order;
    expect(state).toEqual(initialState);
  });

  test('обработка ожидания OrderThunk', () => {
    const action = { type: OrderThunk.pending.type };
    store.dispatch(action);
    const state = store.getState().order;

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка выполнения OrderThunk', () => {
    const mockOrder: TOrder = {
      _id: 'order1',
      status: 'done',
      name: 'Test Order',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: []
    };

    const action = {
      type: OrderThunk.fulfilled.type,
      payload: { order: mockOrder }
    };
    store.dispatch(action);
    const state = store.getState().order;

    expect(state.loading).toBe(false);
    expect(state.order).toEqual(mockOrder);
  });

  test('обработка отклонения OrderThunk', () => {
    const action = {
      type: OrderThunk.rejected.type,
      error: { message: 'Ошибка при получении заказа' }
    };
    store.dispatch(action);
    const state = store.getState().order;

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка при получении заказа');
  });

  test('очистка заказа', () => {
    const mockOrder = {
      _id: 'order1',
      status: 'done',
      name: 'Test Order',
      createdAt: '',
      updatedAt: '',
      number: 1,
      ingredients: []
    };

    const initialAction = {
      type: OrderThunk.fulfilled.type,
      payload: { order: mockOrder }
    };
    store.dispatch(initialAction);

    store.dispatch(clearOrder());
    const state = store.getState().order;

    expect(state.order).toBeNull();
    expect(state.loading).toBe(false);
  });
});
