import { Dispatch } from "redux";
import { setFilteredDoctors, setSuggestions, clearSuggestions } from "./searchDoctorSlice";
import { RootState } from "@/redux/store";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contactNumber: string;
  consultationFee: number;
  experience: number;
  hospitalName: string;
  profilePicture: string;
  city: string;
}

// Generic search function
export const searchDoctors = (query: string) => (dispatch: Dispatch, getState: () => RootState) => {
  const { doctors } = getState().fetchDoctors;
  const filteredDoctors = doctors.filter((doctor) => {
    const lowerCaseQuery = query.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(lowerCaseQuery) ||
      doctor.specialization.toLowerCase().includes(lowerCaseQuery) ||
      doctor.city.toLowerCase().includes(lowerCaseQuery) ||
      doctor.hospitalName.toLowerCase().includes(lowerCaseQuery)
    );
  });
  dispatch(setFilteredDoctors(filteredDoctors));
};

// Fetch suggestions based on the selected category
export const fetchSuggestions = (criteria: "search dr by category" | "name" | "specialization" | "city" | "hospitalName",
  query?: string // Optional query parameter for filtering
) => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const { doctors } = getState().fetchDoctors;
  let allSuggestions: string[] = [];

  if (criteria === "name") {
    allSuggestions = doctors.map((doctor) => doctor.name);
  } else if (criteria === "specialization") {
    allSuggestions = doctors.map((doctor) => doctor.specialization);
  } else if (criteria === "city") {
    allSuggestions = doctors.map((doctor) => doctor.city);
  } else if (criteria === "hospitalName") {
    allSuggestions = doctors.map((doctor) => doctor.hospitalName);
  }else if (criteria === "search dr by category") {
    // For generic search, combine all fields
    allSuggestions = [
      ...doctors.map((doctor) => doctor.name),
      ...doctors.map((doctor) => doctor.specialization),
      ...doctors.map((doctor) => doctor.city),
      ...doctors.map((doctor) => doctor.hospitalName),
    ];
  }

    //   const suggestions = [...new Set(allSuggestions)]; // Show all suggestions for the selected category
    
     // If a query is provided, filter the suggestions
  const suggestions = query
    ? [...new Set(allSuggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase())))]
    : [...new Set(allSuggestions)]; // Show all suggestions if no query is provided


  dispatch(setSuggestions(suggestions));
};