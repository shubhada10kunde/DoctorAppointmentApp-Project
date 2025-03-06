"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DoctorList = () => {
  const { filteredDoctors, loading, error } = useSelector((state: RootState) => state.searchDoctor);

  return (
    <div className="mt-4 px-4">
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {filteredDoctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="p-4 rounded-lg shadow-md" style={{ backgroundColor: "#B9D9EB" }}>
              <h3 className="text-lg font-bold">{doctor.name}</h3>
              <p className="text-gray-700">{doctor.speciality}</p>
              <p className="text-gray-500">{doctor.location}</p>
              <p className="text-gray-500">{doctor.hospital}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;



//********************************************/

"use client";
import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { searchDoctors, fetchSuggestions, clearSuggestions } from "@/redux/features/doctor/searchDoctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
 const [searchCriteria, setSearchCriteria] = useState<"name" | "speciality" | "location">("name");
  const { suggestions } = useSelector((state: RootState) => state.searchDoctor);


  useEffect(() => {
    if (query.trim() !== "") {
      dispatch(fetchSuggestions({ query, criteria: searchCriteria }));
    } else {
      dispatch(clearSuggestions());
    }
  }, [query, searchCriteria, dispatch]);


   const handleSearch = () => {
    if (query.trim() !== "") {
      dispatch(searchDoctors({ query, criteria: searchCriteria }));
    }
    dispatch(clearSuggestions());
  };

  return (
    <div className="relative sm:w-[300px] md:w-[50%] w-full mx-70 mb-5">
      <div className="flex items-center gap-2">
        
      {/* Search Input */}
       <div className="relative flex-1">
          <input
            className="bg-white p-2 px-4 rounded-2xl w-full focus:outline-none border border-gray-300"
            type="text"
            placeholder={`Search Doctor by ${searchCriteria}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          {/* Search Icon */}
          <div
            className="absolute right-0 top-0 h-10 w-20 rounded-2xl cursor-pointer hover:bg-gray-300 flex items-center justify-center" style={{backgroundColor:"#90e0ef"}}
            onClick={handleSearch}
          >
            <BsSearch className="text-gray-600" size={20} />
          </div>
        </div>

     {/* Search By Dropdown */}
         <select
          className="bg-white p-2 px-4 rounded-2xl focus:outline-none border border-gray-300"
          value={searchCriteria}
          onChange={(e) => {
            setSearchCriteria(e.target.value as "name" | "speciality" | "location");
            setQuery(""); // Clear the search input when criteria changes
            dispatch(clearSuggestions()); // Clear suggestions when criteria changes
          }}
        >
          <option value="name">Name</option>
          <option value="speciality">Speciality</option>
          <option value="location">Location</option>
        </select>
   </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setQuery(suggestion);
                handleSearch();
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

//*****************************************************/

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Dummy doctor data
const dummyDoctors = [
  {
    id: "1",
    name: "Dr. Aditya Sharma",
    speciality: "Cardiologist",
    location: "Mumbai",
    hospital: "Apollo Hospital",
  },
  {
    id: "2",
    name: "Dr. Rajesh Verma",
    speciality: "Dermatologist",
    location: "Pune",
    hospital: "AIIMS",
  },
  {
    id: "3",
    name: "Dr. Priya Mehta",
    speciality: "Neurologist",
    location: "Bangalore",
    hospital: "Fortis Hospital",
  },
  {
    id: "4",
    name: "Dr. Vivek Patil",
    speciality: "Orthopedic",
    location: "Pune",
    hospital: "Sahyadri Hospital",
  },
  {
    id: "5",
    name: "Dr. Ananya Joshi",
    speciality: "Pediatrician",
    location: "Hyderabad",
    hospital: "Rainbow Hospital",
  },
];

interface Doctor {
  id: string;
  name: string;
  speciality: string;
  location: string;
  hospital: string;
}

interface SearchState {
  doctors: Doctor[];
  filteredDoctors: Doctor[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  doctors: dummyDoctors, // Store all doctors here
  filteredDoctors: dummyDoctors, // Store filtered results here
  suggestions: [],
  loading: false,
  error: null,
};

// **Fetch Suggestions** (Autocomplete dropdown)
export const fetchSuggestions = createAsyncThunk(
  "searchDoctor/fetchSuggestions",
  async ({
    query,
    criteria,
  }: {
    query: string;
    criteria: "name" | "speciality" | "location";
  }) => {
    if (!query.trim()) return [];
    const lowercaseQuery = query.toLowerCase();

    let allSuggestions: string[] = [];

    if (criteria === "name") {
      allSuggestions = dummyDoctors.map((doctor) => doctor.name);
    } else if (criteria === "speciality") {
      allSuggestions = dummyDoctors.map((doctor) => doctor.speciality);
    } else if (criteria === "location") {
      allSuggestions = dummyDoctors.map((doctor) => doctor.location);
    }

    return [
      ...new Set(
        allSuggestions.filter((item) =>
          item.toLowerCase().includes(lowercaseQuery)
        )
      ),
    ];
  }
);

// **Search Doctors based on selected criteria
export const searchDoctors = createAsyncThunk(
  "searchDoctor/searchDoctors",
  async ({
    query,
    criteria,
  }: {
    query: string;
    criteria: "name" | "speciality" | "location";
  }) => {
    return dummyDoctors.filter((doctor) => {
      if (criteria === "name") {
        return doctor.name.toLowerCase().includes(query.toLowerCase());
      } else if (criteria === "speciality") {
        return doctor.speciality.toLowerCase().includes(query.toLowerCase());
      } else if (criteria === "location") {
        return doctor.location.toLowerCase().includes(query.toLowerCase());
      }
      return true;
    });
  }
);

const searchDoctorSlice = createSlice({
  name: "searchDoctor",
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        searchDoctors.fulfilled,
        (state, action: PayloadAction<Doctor[]>) => {
          state.loading = false;
          state.filteredDoctors = action.payload; // Store filtered doctors here
        }
      )
      .addCase(searchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(
        fetchSuggestions.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.suggestions = action.payload;
        }
      );
  },
});

export const { clearSuggestions } = searchDoctorSlice.actions;
export default searchDoctorSlice.reducer;

//**************************************************/

// src/redux/features/doctor/searchLogic.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Doctor } from "./searchDoctorSlice";
import { fetchDoctorsData } from "./fetchDoctorsData";

// Fetch suggestions for autocomplete
export const fetchSuggestions = createAsyncThunk(
  "searchDoctor/fetchSuggestions",
  async ({
    query,
    criteria,
  }: {
    query: string;
    criteria: "name" | "speciality" | "location";
  }) => {
    if (!query.trim()) return [];
    const lowercaseQuery = query.toLowerCase();

    const doctors = await fetchDoctorsData();
    let allSuggestions: string[] = [];

    if (criteria === "name") {
      allSuggestions = doctors.map((doctor) => doctor.name);
    } else if (criteria === "speciality") {
      allSuggestions = doctors.map((doctor) => doctor.speciality);
    } else if (criteria === "location") {
      allSuggestions = doctors.map((doctor) => doctor.location);
    }

    return [
      ...new Set(
        allSuggestions.filter((item) =>
          item.toLowerCase().includes(lowercaseQuery)
        ),
      ),
    ];
  }
);

// Search doctors based on criteria
export const searchDoctors = createAsyncThunk(
  "searchDoctor/searchDoctors",
  async ({
    query,
    criteria,
  }: {
    query: string;
    criteria: "name" | "speciality" | "location";
  }) => {
    const doctors = await fetchDoctorsData();
    return doctors.filter((doctor) => {
      if (criteria === "name") {
        return doctor.name.toLowerCase().includes(query.toLowerCase());
      } else if (criteria === "speciality") {
        return doctor.speciality.toLowerCase().includes(query.toLowerCase());
      } else if (criteria === "location") {
        return doctor.location.toLowerCase().includes(query.toLowerCase());
      }
      return true;
    });
  }
);

//******************************************************/

import { createAsyncThunk } from "@reduxjs/toolkit";
import { Doctor } from "./searchDoctorSlice";

// Redux async action to fetch doctors data
export const fetchDoctorsData = createAsyncThunk(
  "searchDoctor/fetchDoctorsData",
  async () => {
    try {
      const response = await fetch("/data/doctors.json"); // Fetch JSON from public folder
      if (!response.ok) throw new Error("Failed to fetch doctors data");

      const data = await response.json() as Doctor[];
      console.log("Fetched doctors data:", data); // Debugging
      return data;
    } catch (error) {
      console.error("Error fetching doctors data:", error);
      throw error;
    }
  }
);




//######################################################################################################

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

export const searchDoctors = (query: string, criteria: "name" | "specialization" | "city") => (dispatch: Dispatch, getState: () => RootState) => {
  const { doctors } = getState().fetchDoctors;
  const filteredDoctors = doctors.filter((doctor) => {
    if (criteria === "name") {
      return doctor.name.toLowerCase().includes(query.toLowerCase());
    } else if (criteria === "specialization") {
      return doctor.specialization.toLowerCase().includes(query.toLowerCase());
    } else if (criteria === "city") {
      return doctor.city.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });
  dispatch(setFilteredDoctors(filteredDoctors));
};

export const fetchSuggestions = (query: string, criteria: "name" | "specialization" | "city") => (dispatch: Dispatch, getState: () => RootState) => {
  const { doctors } = getState().fetchDoctors;
  let allSuggestions: string[] = [];

  if (criteria === "name") {
    allSuggestions = doctors.map((doctor) => doctor.name);
  } else if (criteria === "specialization") {
    allSuggestions = doctors.map((doctor) => doctor.specialization);
  } else if (criteria === "city") {
    allSuggestions = doctors.map((doctor) => doctor.city);
  }

  const suggestions = [...new Set(allSuggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase())))];
  dispatch(setSuggestions(suggestions));
};


//#################################################################

"use client"
import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchSuggestions, searchDoctors } from "@/redux/features/doctor/doctorActions";
import {clearSuggestions} from "@/redux/features/doctor/searchDoctorSlice"
import { selectSuggestions } from "@/redux/features/doctor/doctorSelectors";

const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState<"name" | "specialization" | "city">("name");
  const suggestions = useSelector(selectSuggestions);

  useEffect(() => {
    if (query.trim() !== "") {
      dispatch(fetchSuggestions(query, searchCriteria));
    } else {
      dispatch(clearSuggestions());
    }
  }, [query, searchCriteria, dispatch]);

  const handleSearch = () => {
    if (query.trim() !== "") {
      dispatch(searchDoctors(query, searchCriteria));
    }
    dispatch(clearSuggestions());
  };

  return (
    <div className="relative sm:w-[300px] md:w-[50%] w-full mx-70 mb-5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            className="bg-white p-2 px-4 rounded-2xl w-full focus:outline-none border border-gray-300"
            type="text"
            placeholder={`Search Doctor by ${searchCriteria}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div
            className="absolute right-0 top-0 h-10 w-20 rounded-2xl cursor-pointer hover:bg-gray-300 flex items-center justify-center" style={{backgroundColor:"#90e0ef"}}
            onClick={handleSearch}
          >
            <BsSearch className="text-gray-600" size={20} />
          </div>
        </div>
        <select
          className="bg-white p-2 px-4 rounded-2xl focus:outline-none border border-gray-300"
          value={searchCriteria}
          onChange={(e) => {
            setSearchCriteria(e.target.value as "name" | "specialization" | "city");
            setQuery("");
            dispatch(clearSuggestions());
          }}
        >
          <option value="name">Name</option>
          <option value="specialization">Specialization</option>
          <option value="city">City</option>
        </select>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setQuery(suggestion);
                handleSearch();
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

When your backend developer is creating two separate API endpoints—one for fetching all doctors and another for searching doctors—you need to handle both endpoints in your Redux logic. Here's how you can structure your code to accommodate both APIs:

1. API Endpoints
Assume your backend provides the following endpoints:

Fetch All Doctors: GET /api/doctors

Search Doctors: GET /api/doctors/search?query=<search-term>&criteria=<search-criteria>

2. Update Redux Slices
You will need to create two separate async thunks: one for fetching all doctors and another for searching doctors.

fetchDoctorsSlice.ts (For Fetching All Doctors)
typescript
Copy
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Doctor } from "./doctorActions";
import { AppDispatch } from "@/redux/store";

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
      const response = await axios.get<Doctor[]>("/api/doctors"); // Fetch all doctors
      if (response.status !== 200) throw new Error("Failed to fetch doctors data");

      const data = response.data;
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
searchDoctorSlice.ts (For Searching Doctors)
typescript
Copy
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Doctor } from "./doctorActions";
import { AppDispatch, RootState } from "@/redux/store";

interface SearchState {
  filteredDoctors: Doctor[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  filteredDoctors: [],
  suggestions: [],
  loading: false,
  error: null,
};

export const searchDoctors = createAsyncThunk(
  "searchDoctor/searchDoctors",
  async (
    { query, criteria }: { query: string; criteria: "name" | "specialization" | "city" },
    { dispatch }
  ) => {
    try {
      const response = await axios.get<Doctor[]>(`/api/doctors/search`, {
        params: { query, criteria }, // Pass query and criteria as query parameters
      });
      if (response.status !== 200) throw new Error("Failed to search doctors");

      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error searching doctors:", error);
      throw error;
    }
  }
);

const searchDoctorSlice = createSlice({
  name: "searchDoctor",
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDoctors.fulfilled, (state, action: PayloadAction<Doctor[]>) => {
        state.loading = false;
        state.filteredDoctors = action.payload;
      })
      .addCase(searchDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { clearSuggestions } = searchDoctorSlice.actions;
export default searchDoctorSlice.reducer;
3. Update Actions and Selectors
doctorActions.ts
This file will contain the logic for fetching suggestions (autocomplete) and searching doctors.

typescript
Copy
import { Dispatch } from "redux";
import axios from "axios";
import { setSuggestions, clearSuggestions } from "./searchDoctorSlice";
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

export const fetchSuggestions = (query: string, criteria: "name" | "specialization" | "city") => async (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  try {
    const response = await axios.get<string[]>(`/api/doctors/suggestions`, {
      params: { query, criteria }, // Pass query and criteria as query parameters
    });
    if (response.status !== 200) throw new Error("Failed to fetch suggestions");

    const suggestions = response.data;
    dispatch(setSuggestions(suggestions));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    dispatch(clearSuggestions());
  }
};
doctorSelectors.ts
This file will contain selectors for accessing the Redux state.

typescript
Copy
import { RootState } from "@/redux/store";

export const selectDoctors = (state: RootState) => state.fetchDoctors.doctors;
export const selectFilteredDoctors = (state: RootState) => state.searchDoctor.filteredDoctors;
export const selectSuggestions = (state: RootState) => state.searchDoctor.suggestions;
export const selectLoading = (state: RootState) => state.fetchDoctors.loading || state.searchDoctor.loading;
export const selectError = (state: RootState) => state.fetchDoctors.error || state.searchDoctor.error;
4. Update Components
SearchBar.tsx
This component will handle the search functionality and fetch suggestions.

typescript
Copy
import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchSuggestions, searchDoctors, clearSuggestions } from "@/redux/features/doctor/doctorActions";
import { selectSuggestions } from "@/redux/features/doctor/doctorSelectors";

const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState<"name" | "specialization" | "city">("name");
  const suggestions = useSelector(selectSuggestions);

  useEffect(() => {
    if (query.trim() !== "") {
      dispatch(fetchSuggestions(query, searchCriteria));
    } else {
      dispatch(clearSuggestions());
    }
  }, [query, searchCriteria, dispatch]);

  const handleSearch = () => {
    if (query.trim() !== "") {
      dispatch(searchDoctors({ query, criteria: searchCriteria }));
    }
    dispatch(clearSuggestions());
  };

  return (
    <div className="relative sm:w-[300px] md:w-[50%] w-full mx-70 mb-5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            className="bg-white p-2 px-4 rounded-2xl w-full focus:outline-none border border-gray-300"
            type="text"
            placeholder={`Search Doctor by ${searchCriteria}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div
            className="absolute right-0 top-0 h-10 w-20 rounded-2xl cursor-pointer hover:bg-gray-300 flex items-center justify-center" style={{backgroundColor:"#90e0ef"}}
            onClick={handleSearch}
          >
            <BsSearch className="text-gray-600" size={20} />
          </div>
        </div>
        <select
          className="bg-white p-2 px-4 rounded-2xl focus:outline-none border border-gray-300"
          value={searchCriteria}
          onChange={(e) => {
            setSearchCriteria(e.target.value as "name" | "specialization" | "city");
            setQuery("");
            dispatch(clearSuggestions());
          }}
        >
          <option value="name">Name</option>
          <option value="specialization">Specialization</option>
          <option value="city">City</option>
        </select>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setQuery(suggestion);
                handleSearch();
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
5. Summary
Use two separate API endpoints: one for fetching all doctors and another for searching.

Create separate async thunks for each endpoint.

Use axios to make API calls and handle responses.

Update your components to dispatch the appropriate actions based on user input.