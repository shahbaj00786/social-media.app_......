import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import messagesReducer from "../features/messages/messageSlice";
import connectionsReducer from "../features/connections/connectionSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    connections: connectionsReducer,
    messages: messagesReducer,
  },
});
