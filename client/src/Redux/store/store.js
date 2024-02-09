import { configureStore } from "@reduxjs/toolkit";
import settingReducer from "../state-slice/settingSlice";
import taskForReducer from "../state-slice/taskSlice";
import summaryReducer from "../state-slice/summarySlice"
import profileReducer from "../state-slice/profileSlice"
export default configureStore({
  reducer: {
    settings: settingReducer,
    task: taskForReducer,
    summary: summaryReducer,
    profile: profileReducer,
  },
});
