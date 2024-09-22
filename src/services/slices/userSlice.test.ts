import {
  setAuthChecked,
  userSlice,
  UserState,
  getUserThunk,
  registerUserThunk,
  loginUserThunk,
  logoutUserThunk,
  updateUserThunk,
  getUserOrdersThunk
} from './userSlice';

import { TRegisterData, TLoginData } from '@api';

describe('userSlice', () => {
  jest.mock('@api', () => ({
    registerUserApi: jest.fn(() => Promise.resolve(testUser)),
    loginUserApi: jest.fn(() => Promise.resolve(testUser)),
    getUserApi: jest.fn(() => Promise.resolve(testUser)),
    logoutApi: jest.fn(() => Promise.resolve(testUser)),
    updateUserApi: jest.fn(() => Promise.resolve(testUser)),
    getOrdersApi: jest.fn(() => Promise.resolve(testUser))
  }));

  beforeEach(() => {
    jest.clearAllMocks(); // Очистить моки перед каждым тестом
  });

  const initialState = {
    orders: [],
    isAuthChecked: false,
    loading: false,
    user: null,
    error: null
  };

  const testUser = {
    user: { email: 'e.d.khimich.work@gmail.com', name: 'Kate' },
    success: true,
    refreshToken: 'someRefreshToken',
    accessToken: 'someAccessToken'
  };

  const testRegisterData: TRegisterData = {
    email: 'e.d.khimich.work@gmail.com',
    name: 'Kate',
    password: 'password2000'
  };

  const testLoginData: TLoginData = {
    email: 'e.d.khimich.work@gmail.com',
    password: 'password2000'
  };

  test('начальная проверка', () => {
    expect(userSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('смена статуса isAuthChecked', () => {
    const expectedState: UserState = {
      ...initialState,
      isAuthChecked: true
    };
    const actualState = userSlice.reducer(initialState, setAuthChecked());
    expect(actualState).toEqual(expectedState);
  });

  test('выход из системы, loading', () => {
    const actual = userSlice.reducer(
      { ...initialState, user: testRegisterData },
      logoutUserThunk.pending('')
    );
    expect(actual).toEqual({
      isAuthChecked: false,
      user: null,
      loading: true,
      error: null,
      orders: []
    });
  });

  test('выход из системы, success', () => {
    const actual = userSlice.reducer(
      { ...initialState, user: testRegisterData },
      logoutUserThunk.fulfilled({ success: true }, '')
    );
    expect(actual).toEqual({
      isAuthChecked: true,
      user: null,
      loading: false,
      error: null,
      orders: []
    });
  });

  test('вход в систему, loading', () => {
    const actual = userSlice.reducer(
      { ...initialState, user: null },
      loginUserThunk.pending('', testLoginData)
    );

    expect(actual).toEqual({
      ...initialState,
      loading: true,
      user: null, // Пользователь еще не вошел в систему
      isAuthChecked: false,
      error: null
    });
  });

  test('вход в систему, success', () => {
    const actual = userSlice.reducer(
      initialState,
      loginUserThunk.fulfilled(testUser, '', testLoginData)
    );

    expect(actual).toEqual({
      ...initialState,
      isAuthChecked: true,
      user: testUser.user, // Пользователь успешно вошел в систему
      error: null
    });
  });

  test('вход в систему, error', () => {
    const actual = userSlice.reducer(
      initialState,
      loginUserThunk.rejected(new Error('Ошибка'), '', testLoginData)
    );

    expect(actual).toEqual({
      ...initialState,
      isAuthChecked: true,
      user: null,
      error: 'Ошибка'
    });
  });

  test('регистрация, loading', () => {
    const actual = userSlice.reducer(
      initialState,
      registerUserThunk.pending('', testRegisterData)
    );

    expect(actual).toEqual({
      ...initialState,
      isAuthChecked: false,
      loading: true,
      user: null,
      error: null
    });
  });

  test('регистрация, success', () => {
    const actual = userSlice.reducer(
      initialState,
      registerUserThunk.fulfilled(testUser, '', testRegisterData)
    );

    expect(actual).toEqual({
      ...initialState,
      isAuthChecked: true,
      user: testUser.user,
      error: null,
      loading: false
    });
  });

  test('регистрация, error', () => {
    const actual = userSlice.reducer(
      initialState,
      registerUserThunk.rejected(new Error('Ошибка'), '', testRegisterData)
    );

    expect(actual).toEqual({
      ...initialState,
      isAuthChecked: true,
      user: null,
      error: 'Ошибка',
      loading: false
    });
  });

  test('редактирование профиля, loading', () => {
    const actual = userSlice.reducer(
      initialState,
      updateUserThunk.pending('', testRegisterData)
    );

    expect(actual).toEqual({
      ...initialState,
      isAuthChecked: false,
      loading: true,
      error: null,
      user: null
    });
  });

  test('редактирование профиля, success', () => {
    const actual = userSlice.reducer(
      initialState,
      updateUserThunk.fulfilled(testUser, '', testRegisterData)
    );

    expect(actual).toEqual({
      ...initialState,
      isAuthChecked: true,
      user: testUser.user,
      error: null,
      loading: false
    });
  });

  test('редактирование профиля, error', () => {
    const actual = userSlice.reducer(
      initialState,
      updateUserThunk.rejected(new Error('Ошибка'), '', testRegisterData)
    );

    expect(actual).toEqual({
      ...initialState,
      isAuthChecked: true,
      user: null,
      error: 'Ошибка',
      loading: false
    });
  });

  test('получение данных пользователя, loading', () => {
    const actual = userSlice.reducer(initialState, getUserThunk.pending(''));

    expect(actual).toEqual({
      ...initialState,
      error: null,
      isAuthChecked: false
    });
  });

  test('получение данных пользователя, success', async () => {
    const actual = userSlice.reducer(
      initialState,
      getUserThunk.fulfilled(testUser, '')
    );

    expect(actual).toEqual({
      ...initialState,
      user: testUser.user,
      isAuthChecked: true,
      error: null
    });
  });

  test('получение данных пользователя, error', () => {
    const actual = userSlice.reducer(
      initialState,
      getUserThunk.rejected(new Error('Ошибка'), '')
    );

    expect(actual).toEqual({
      ...initialState,
      error: 'Ошибка',
      isAuthChecked: true,
      user: null // user остается null, так как он не был успешно загружен
    });
  });

  test('получение заказов, loading', () => {
    const actual = userSlice.reducer(
      initialState,
      getUserOrdersThunk.pending('')
    );

    expect(actual).toEqual({
      ...initialState,
      loading: true
    });
  });

  test('получение заказов, success', async () => {
    const testOrders = [
      {
        ingredients: [],
        _id: '6647615997ede0001d06b23d',
        owner: {},
        status: 'done',
        name: 'Флюоресцентный люминесцентный бургер',
        createdAt: '2024-05-17T13:53:29.807Z',
        updatedAt: '2024-05-17T13:53:30.243Z',
        number: 40223,
        price: 1976
      }
    ];

    const actual = userSlice.reducer(
      initialState,
      getUserOrdersThunk.fulfilled(testOrders, '')
    );

    expect(actual).toEqual({
      ...initialState,
      orders: testOrders
    });
  });

  test('получение заказов, error', async () => {
    const actual = userSlice.reducer(
      initialState,
      getUserOrdersThunk.rejected(new Error('Ошибка'), '')
    );

    expect(actual).toEqual({
      ...initialState,
      error: 'Ошибка'
    });
  });
});
