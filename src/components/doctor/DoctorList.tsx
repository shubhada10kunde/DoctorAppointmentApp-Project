"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchDoctorsData } from "@/redux/features/doctor/fetchDoctorSlice";
import { selectFilteredDoctors, selectLoading, selectError } from "@/redux/features/doctor/doctorSelectors";
import DoctorCard from "./DoctorCard";

const DoctorList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filteredDoctors = useSelector(selectFilteredDoctors);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchDoctorsData());
  }, [dispatch]);

  return (
    <div className="mt-4 px-4">
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {filteredDoctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;