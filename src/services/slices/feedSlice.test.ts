import feedReducer, {
  getFeedsThunk,
  initialState,
  RequestsStatus,
  getOrderByNumberThunk
} from './feedSlice';

import { TOrdersData } from '@utils-types';

describe('feedSlice', () => {
  const orderData: TOrdersData = {
    orders: [
      {
        _id: 'order1',
        status: 'done',
        name: 'Test Order 1',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: []
      },
      {
        _id: 'order2',
        status: 'pending',
        name: 'Test Order 2',
        createdAt: '',
        updatedAt: '',
        number: 2,
        ingredients: []
      }
    ],
    total: 100,
    totalToday: 20
  };

  test('ожидание получения ленты заказов getFeeds', () => {
    const action = { type: getFeedsThunk.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Loading);
  });

  test('успешно получена лента заказов getFeeds', () => {
    const action = { type: getFeedsThunk.fulfilled.type, payload: orderData };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Success);
    expect(state.orders).toEqual(orderData.orders);
    expect(state.total).toEqual(orderData.total);
    expect(state.totalToday).toEqual(orderData.totalToday);
  });

  test('запрос на получение ленты заказов getFeeds отклонен', () => {
    const action = { type: getFeedsThunk.rejected.type };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Failed);
  });

  test('ожидание получения заказа getOrderByNumber', () => {
    const action = { type: getOrderByNumberThunk.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Loading);
  });

  test('успешно получен заказ getOrderByNumber', () => {
    const action = {
      type: getOrderByNumberThunk.fulfilled.type,
      payload: orderData
    };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Success);
    expect(state.order).toEqual(orderData.orders[0]);
  });

  test('запрос на получение заказа getOrderByNumber отклонен', () => {
    const action = { type: getOrderByNumberThunk.rejected.type };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestsStatus.Failed);
  });
});
