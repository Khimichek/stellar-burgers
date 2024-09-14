import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  TLoginData,
  logoutApi,
  TRegisterData,
  registerUserApi,
  updateUserApi,
  getOrdersApi
} from '@api';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import { TOrder, TUser } from '@utils-types';
import { RootState } from '../store';

export interface UserState {
  isAuthChecked: boolean;
  loading: boolean;
  user: TUser | null;
  orders: TOrder[];
  error: string | null;
}

export const initialState: UserState = {
  orders: [],
  isAuthChecked: false,
  loading: false,
  user: null,
  error: null
};

export const getUserThunk = createAsyncThunk('user/getUser', async () =>
  getUserApi()
);

export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) =>
    registerUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    })
);

export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) =>
    loginUserApi(data).then((data) => {
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    })
);

export const logoutUserThunk = createAsyncThunk('user/logoutUser', async () => {
  const data = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return data;
});

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const getUserOrdersThunk = createAsyncThunk<TOrder[]>(
  'user/getUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const isAuthUserThunk = createAsyncThunk(
  'user/isAuthUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(getUserThunk());
    }
    dispatch(setAuthChecked());
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked(state) {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Ой, произошла ошибка!';
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ой, произошла ошибка!';
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ой, произошла ошибка!';
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.user = null;
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ой, произошла ошибка!';
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(getUserOrdersThunk.pending, (state) => {
        //state.isAuthChecked = true;
        //state.error = null;
        state.loading = true;
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        //state.isAuthChecked = false;
        state.error = action.error.message || 'Ой, произошла ошибка!';
        //state.loading = false;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        //state.error = null;
        //state.isAuthChecked = false;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserOrders: (state) => state.orders,
    //userLoadingSelector: (state) => state.loading,
    selectError: (state) => state.error
  }
});

export const {
  selectUser,
  selectIsAuthChecked,
  selectUserOrders,
  selectError
} = userSlice.selectors;
export const { setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
