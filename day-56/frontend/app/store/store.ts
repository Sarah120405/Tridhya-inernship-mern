import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./slice/authSlice";
import AiReducer from "./slice/aiSlice";
import TicketReducer from "./slice/ticketSlice";
import MessageReducer from "./slice/messageSlice";
import UserReducer from "./slice/userSlice";
import AssignmentReducer from "./slice/assignmentSlice";
import ActivityReducer from "./slice/activitySlice";
import SlaReducer from "./slice/slaSlice";
import ReportReducer from "./slice/reportSlice";

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    ai: AiReducer,
    ticket: TicketReducer,
    message: MessageReducer,
    user: UserReducer,
    assignment: AssignmentReducer,
    activity: ActivityReducer,
    sla: SlaReducer,
    report: ReportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
