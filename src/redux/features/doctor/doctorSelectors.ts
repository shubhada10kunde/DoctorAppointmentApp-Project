import { RootState } from "@/redux/store";

export const selectDoctors = (state: RootState) => state.fetchDoctors.doctors;
export const selectFilteredDoctors = (state: RootState) => state.searchDoctor.filteredDoctors;
export const selectSuggestions = (state: RootState) => state.searchDoctor.suggestions;
export const selectLoading = (state: RootState) => state.fetchDoctors.loading;
export const selectError = (state: RootState) => state.fetchDoctors.error;