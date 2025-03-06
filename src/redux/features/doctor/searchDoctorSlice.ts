import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Doctor } from "./doctorActions";

interface SearchState {
  filteredDoctors: Doctor[];
  suggestions: string[];
}

const initialState: SearchState = {
  filteredDoctors: [],
  suggestions: [],
};

const searchDoctorSlice = createSlice({
  name: "searchDoctor",
  initialState,
  reducers: {
    setFilteredDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.filteredDoctors = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
});

export const { setFilteredDoctors, setSuggestions, clearSuggestions } = searchDoctorSlice.actions;
export default searchDoctorSlice.reducer;