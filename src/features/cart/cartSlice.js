import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const url = "https://course-api.com/react-useReducer-cart-project";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

export const getCartItems = createAsyncThunk("cart/getCartItems", async (name, thunkAPI) => {
  try {
    // console.log(thunkAPI);
    // console.log(thunkAPI.getState());
    const res = await axios(url);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("something went wrong");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: state => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter(item => item.id !== itemId);
    },
    increaseAmount: (state, { payload }) => {
      const cartItem = state.cartItems.find(item => item.id === payload.id);
      cartItem.amount += 1;
    },
    decreaseAmount: (state, { payload }) => {
      const cartItem = state.cartItems.find(item => item.id === payload.id);
      cartItem.amount -= 1;
    },
    calculateTotals: state => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach(item => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCartItems.pending, state => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// console.log(cartSlice);
export const { clearCart, removeItem, increaseAmount, decreaseAmount, calculateTotals } = cartSlice.actions;

export default cartSlice.reducer;
