import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

enum RequestsStatus {
  Idle = 'Idle',
  Loading = 'Loading',
  Success = 'Success',
  Failed = 'Failed'
}

type TIngredientState = {
  data: TIngredient[];
  status: RequestsStatus;
};

export const initialState: TIngredientState = {
  data: [],
  status: RequestsStatus.Idle
};

export const getIngredientsThunk = createAsyncThunk<TIngredient[]>(
  'ingredients/getIngredients',
  async () => await getIngredientsApi()
);

export const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.status = RequestsStatus.Loading;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.status = RequestsStatus.Success;
        state.data = action.payload;
      })
      .addCase(getIngredientsThunk.rejected, (state) => {
        state.status = RequestsStatus.Failed;
      });
  },
  selectors: {
    selectIngredientsData: (state: TIngredientState) => state.data,
    selectIngredientsStatus: (state: TIngredientState) => state.status
  }
});

export const selectIngredients = ingredientSlice.selectors;
