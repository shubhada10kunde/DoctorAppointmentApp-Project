import React from "react";
import { Doctor } from "@/redux/features/doctor/doctorActions";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div
      className="flex p-4 rounded-lg shadow-md gap-4"
      style={{ backgroundColor: "#bdd5ea" }}
    >
      {/* Image on the left side */}
      
         <div className="w-25 h-25 flex-shrink-0">
          <img
            src={doctor.profilePicture} 
            alt={doctor.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* <h3 className="text-lg font-bold">{doctor.name}</h3> */}
      

      {/* Doctor details on the right side */}
      <div className="flex flex-col justify-center flex-1">
        <h3 className="text-lg font-bold">{doctor.name}</h3>
        <p className="text-gray-700">{doctor.specialization}</p>
        <p className="text-gray-700">{`${doctor.experience} yrs experience`}</p>

        {/* Ratings */}
        <div className="flex items-center mt-2">
          <span className="text-yellow-500">★★★★☆</span>{" "}
          <span className="text-gray-600 ml-2">(4.5)</span>{" "}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
