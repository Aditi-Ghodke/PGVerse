import React, { useEffect, useState } from "react";
import { getAllPg } from "../api/pgpropertyApi"; 
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { MdCategory } from "react-icons/md";

const PGList = () => {
  const [pgs, setPGs] = useState([]);
  const [filteredPGs, setFilteredPGs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const data = await getAllPg();
        console.log("API response:", data);

        // Adjust this depending on your actual API response shape:
        // For example, if API returns { data: [...] }, or { content: [...] }, etc.
        const pgList = data.data || data.content || data;

        if (Array.isArray(pgList)) {
          setPGs(pgList);
          setFilteredPGs(pgList);
        } else {
          console.error("PG list is not an array:", pgList);
          setPGs([]);
          setFilteredPGs([]);
        }
      } catch (err) {
        console.error("Error fetching PGs", err);
        setPGs([]);
        setFilteredPGs([]);
      }
    };
    fetchPGs();
  }, []);

  useEffect(() => {
    if (!Array.isArray(pgs)) {
      setFilteredPGs([]);
      return;
    }

    const filtered = pgs.filter(pg => {
      const locationMatch = pg.location?.toLowerCase().includes(locationFilter.toLowerCase());
      const categoryMatch = categoryFilter
        ? pg.pgType === categoryFilter
        : true;
      return locationMatch && categoryMatch;
    });
    setFilteredPGs(filtered);
  }, [locationFilter, categoryFilter, pgs]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 justify-end">
        <label className="text-lg font-semibold">Find your PG</label>

        <input
          type="text"
          placeholder="Search by location..."
          value={locationFilter}
          onChange={e => setLocationFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-64"
        />

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-48"
        >
          <option value="">All Categories</option>
          <option value="GIRLS">Girls</option>
          <option value="BOYS">Boys</option>
          <option value="UNISEX">Unisex</option>
        </select>
      </div>

      {Array.isArray(filteredPGs) && filteredPGs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPGs.map(pg => (
            <div
              key={pg.pgId}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/pg/${pg.pgId}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={`http://localhost:8080/${pg.imagePath}`}
                  alt={pg.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-800 truncate">{pg.name}</h2>

                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FiMapPin className="text-gray-400" />
                  {pg.location}
                </p>

                <p className="text-sm text-gray-700 flex items-center gap-1 mt-1 capitalize">
                  <MdCategory className="text-gray-500" />
                  {pg.pgType?.toLowerCase()}
                </p>

                <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                  {pg.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No PGs found matching your criteria.</p>
      )}
    </div>
  );
};

export default PGList;
