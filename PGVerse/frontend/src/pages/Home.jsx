import React, { useEffect, useState } from "react";
import { getAllPg } from "../api/pgpropertyApi";
import { useNavigate } from "react-router-dom";
import PGList from "../components/PGList";

const HomePage = () => {
  const [pgList, setPgList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPg()
      .then(res => setPgList(res.data))
      .catch(err => console.error("Failed to fetch PGs", err));
  }, []);

  const handleCardClick = (pgId) => {
    navigate(`/pg/${pgId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <PGList/>
      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700">
        Available PGs
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {pgList.map((pg, index) => (
          <div
            key={pg.pgId ?? `pg-${index}`}  // fallback to index if pgId missing
            className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 bg-white"
            onClick={() => handleCardClick(pg.pgId)}
          >
            <img
              src={`http://localhost:8080/${pg.imagePath}`} 
              alt={pg.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{pg.name}</h2>
              <p className="text-gray-600 font-medium">{pg.location}</p>
              <p className="mt-3 text-gray-700 text-sm line-clamp-3">{pg.description}</p>
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default HomePage;
