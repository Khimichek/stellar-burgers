import { TIngredient, TOrder } from '@utils-types';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

enum RequestsStatus {
  Idle = 'Idle',
  Loading = 'Loading',
  Success = 'Success',
  Failed = 'Failed'
}

type TFeedsState = {
  orders: TOrder[];
  order: TOrder | null;
  total: number;
  totalToday: number;
  status: RequestsStatus;
};

export const initialState: TFeedsState = {
  orders: [],
  order: null,
  total: 0,
  totalToday: 0,
  status: RequestsStatus.Idle
};

export const getFeedsThunk = createAsyncThunk('feed/getFeeds', async () =>
  getFeedsApi()
);

export const getOrderByNumberThunk = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.status = RequestsStatus.Loading;
      })
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.status = RequestsStatus.Failed;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.status = RequestsStatus.Success;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.status = RequestsStatus.Loading;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.status = RequestsStatus.Failed;
        state.order = action.payload.orders[0];
      })
      .addCase(getOrderByNumberThunk.rejected, (state) => {
        state.status = RequestsStatus.Success;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedOrder: (state) => state.order,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday
    //feedErrorSelector: (state) => state.error
  }
});

export const {
  selectFeedOrders,
  selectFeedOrder,
  selectFeedTotal,
  selectFeedTotalToday
} = feedSlice.selectors;
export default feedSlice.reducer;