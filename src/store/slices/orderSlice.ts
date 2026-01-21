// src/store/slices/orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  mrp: number;
  price: number;
}

interface OrdersState {
  items: OrderItem[];
}

const initialState: OrdersState = {
  items: [],
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrderItem: (state, action: PayloadAction<OrderItem>) => {
      const existing = state.items.find(
        (item) => item.medicineId === action.payload.medicineId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
   updateQuantity: (
  state,
  action: PayloadAction<{ id: string; quantity: number; price: number }>
) => {
  const item = state.items.find((i) => i.medicineId === action.payload.id);
  if (item) {
    item.quantity = action.payload.quantity;
    item.price = action.payload.price;
  }
},
    removeOrderItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.medicineId !== action.payload);
    },
    clearOrders: (state) => {
      state.items = [];
    },
  },
});

export const {
  addOrderItem,
  updateQuantity,
  removeOrderItem,
  clearOrders,
} = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
