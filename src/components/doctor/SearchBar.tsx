"use client";
import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchSuggestions,
  searchDoctors,
} from "@/redux/features/doctor/doctorActions";
import { clearSuggestions } from "@/redux/features/doctor/searchDoctorSlice";
import { selectSuggestions } from "@/redux/features/doctor/doctorSelectors";

const SearchBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState("");
  // const [searchCriteria, setSearchCriteria] = useState<"name" | "specialization" | "city" | "hospitalName">("name");

  const [searchCriteria, setSearchCriteria] = useState<
    | "search dr by category"
    | "name"
    | "specialization"
    | "city"
    | "hospitalName"
  >("search dr by category");
  const suggestions = useSelector(selectSuggestions);

  // Fetch suggestions immediately when the category changes
  // useEffect(() => {
  //   dispatch(fetchSuggestions(searchCriteria));
  // }, [searchCriteria, dispatch]);

  // Fetch suggestions immediately when the category changes
  useEffect(() => {
    if (searchCriteria !== "search dr by category") {
      dispatch(fetchSuggestions(searchCriteria));
    } else {
      dispatch(clearSuggestions()); // Clear suggestions when "search dr by category" is selected
    }
  }, [searchCriteria, dispatch]);

  // Fetch suggestions based on query input
  useEffect(() => {
    if (query.trim() !== "") {
      dispatch(fetchSuggestions(searchCriteria, query));
    } else {
      dispatch(clearSuggestions());
    }
  }, [query,searchCriteria, dispatch]);

  // Fetch suggestions based on query input
  // useEffect(() => {
  //   if (query.trim() !== "" && searchCriteria !== "search dr by category") {
  //     dispatch(fetchSuggestions(searchCriteria));
  //   } else {
  //     dispatch(clearSuggestions());
  //   }
  // }, [query, searchCriteria, dispatch]);

  const handleSearch = () => {
    if (query.trim() !== "") {
      dispatch(searchDoctors(query));
    }
    dispatch(clearSuggestions());
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mb-5 px-4">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="relative flex-1 w-full md:w-auto">
          <input
            className="bg-white p-2 px-4 rounded-2xl w-full focus:outline-none border border-gray-300 text-sm sm:text-base"
            type="text"
            // placeholder={`Search Doctor by ${searchCriteria}...`}
            placeholder={
              searchCriteria === "search dr by category"
                ? "Search Doctor by name, specialization, city, or hospital..."
                : `Search Doctor by ${searchCriteria}...`
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div
            className="absolute right-0 top-0 h-10 w-20 rounded-2xl cursor-pointer hover:bg-gray-300 flex items-center justify-center"
            style={{ backgroundColor: "#bdd5ea" }}
            onClick={handleSearch}
          >
            <BsSearch className="text-gray-600" size={20} />
          </div>
        </div>
        {/* <select
          className="bg-white p-2 px-4 rounded-2xl focus:outline-none border border-gray-300"
          value={searchCriteria}
          onChange={(e) => {
            setSearchCriteria(e.target.value as "name" | "specialization" | "city" | "hospitalName");
            setQuery("");
            dispatch(fetchSuggestions(e.target.value as "name" | "specialization" | "city" | "hospitalName"));
          }}
        > */}

        <select
          className="bg-white p-2 px-4 rounded-2xl focus:outline-none border border-gray-300 text-sm sm:text-base w-full md:w-auto"
          value={searchCriteria}
          onChange={(e) => {
            const selectedCriteria = e.target.value as
              | "search dr by category"
              | "name"
              | "specialization"
              | "city"
              | "hospitalName";
            setSearchCriteria(selectedCriteria);
            setQuery("");
            if (selectedCriteria !== "search dr by category") {
              dispatch(fetchSuggestions(selectedCriteria));
            } else {
              dispatch(clearSuggestions());
            }
          }}
        >
          <option value="search dr by category">
            Search Doctor by Category
          </option>
          <option value="name">Name</option>
          <option value="specialization">Specialization</option>
          <option value="city">City</option>
          <option value="hospitalName">Hospital Name</option>
        </select>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-md z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer text-sm sm:text-base"
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
