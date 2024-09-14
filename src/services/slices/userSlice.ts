import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  TLoginData,
  logoutApi,
  TRegisterData,
  registerUserApi,
  updateUserApi
} from '@api';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import { RootState } from '../store';

export interface UserState {
  isAuthChecked: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | null;
}

export const initialState: UserState = {
  isAuthChecked: false,
  isLoading: false,
  user: null,
  error: null
};

export const getUserThunk = createAsyncThunk('user/getUser', async () =>
  getUserApi()
);

export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => await registerUserApi(data)
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
      });
  }
});

// Селекторы
export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectError = (state: RootState): string | null | undefined =>
  state.user.error;
export const selectIsAuthenticated = (state: RootState): boolean =>
  !!state.user.user;

export const { setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
