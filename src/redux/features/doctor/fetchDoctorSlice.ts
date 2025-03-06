import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Doctor } from "./doctorActions";
import { setFilteredDoctors } from "./searchDoctorSlice";
import { AppDispatch } from "@/redux/store";
import axios from "axios";

interface FetchState {
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
}

const initialState: FetchState = {
  doctors: [],
  loading: false,
  error: null,
};

export const fetchDoctorsData = createAsyncThunk(
  "fetchDoctors/fetchDoctorsData",
  async (_, { dispatch }) => {
    try {
      //   const response = await fetch("/data/doctors.json");
      //   if (!response.ok) throw new Error("Failed to fetch doctors data");

      //     const data = await response.json() as Doctor[];

      //*****// Use axios.get ******//*/
      const response = await axios.get<Doctor[]>("/data/doctors.json");
      if (response.status !== 200)
        throw new Error("Failed to fetch doctors data");

      const data = response.data; // Access data from the response
      console.log("Fetched doctors data:", data); // Debugging
      dispatch(setFilteredDoctors(data));

      return data;
    } catch (error) {
      console.error("Error fetching doctors data:", error);
      throw error;
    }
  }
);

const fetchDoctorsSlice = createSlice({
  name: "fetchDoctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorsData.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctorsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default fetchDoctorsSlice.reducer;
