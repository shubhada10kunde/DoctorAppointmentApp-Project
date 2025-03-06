import { configureStore } from "@reduxjs/toolkit";
import searchDoctorReducer from "./features/doctor/searchDoctorSlice";
import fetchDoctorsReducer from "./features/doctor/fetchDoctorSlice";

export const store = configureStore({
    reducer: {
         fetchDoctors: fetchDoctorsReducer,
        searchDoctor: searchDoctorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;