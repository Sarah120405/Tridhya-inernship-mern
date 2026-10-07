import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppNotification {
  id: string;
  message: string;
  ticketId: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  items: AppNotification[];
}

const initialState: NotificationState = { items: [] };

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.items.unshift(action.payload);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload); // remove instead of flag
    },
    markAllAsRead: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
