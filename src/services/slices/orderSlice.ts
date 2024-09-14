import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

export interface TOrderState {
  order: TOrder | null;
  error: string | null;
  loading: boolean;
}

export const initialState: TOrderState = {
  order: null,
  error: null,
  loading: false
};

export const OrderThunk = createAsyncThunk(
  'order/newOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(OrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ой, произошла ошибка!';
      })
      .addCase(OrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      });
  },
  selectors: {
    selectOrder: (state) => state.order,
    selectOrderLoading: (state) => state.loading
  }
});

export const { selectOrder, selectOrderLoading } = orderSlice.selectors;
export default orderSlice.reducer;
export const { clearOrder } = orderSlice.actions;
