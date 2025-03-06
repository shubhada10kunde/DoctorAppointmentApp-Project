import React from "react";

const Navbar = () => {
  return (
    <div className="border-b border-gray-200 bg-gray-200 py-6" style={{backgroundColor:"#bdd5ea"}}>
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Logo */}
        <div className="font-bold text-4xl text-center pb-4 sm:pb-0 text-black">
          Logo
        </div>

        {/* <SearchBar /> */}

        {/* <div>
                  <select className="border p-2 rounded-lg w-full">
                      <option value="">All Specialities</option>
                      <option>Dentist</option>
                      <option>Dentist</option>
                      <option>Dentist</option>
                      <option>Dentist</option>
                  </select>
              </div> */}
      </div>
    </div>
  );
};

export default Navbar;
