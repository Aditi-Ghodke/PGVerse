import React, { useEffect, useState } from "react";
import { getAllPg } from "../api/pgpropertyApi";
import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { MdCategory } from "react-icons/md";
import Footer from "./Footer";

const PGList = () => {
  const [pgs, setPGs] = useState([]);
  const [filteredPGs, setFilteredPGs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  // const min = minPrice ? Number(minPrice) : 0;
  // const max = maxPrice ? Number(maxPrice) : Infinity;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const data = await getAllPg();
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

    const filtered = pgs.filter((pg) => {
      const locationMatch = pg.location
        ?.toLowerCase()
        .includes(locationFilter.toLowerCase());
      const categoryMatch = categoryFilter
        ? pg.pgType === categoryFilter
        : true;

      return locationMatch && categoryMatch;
    });
    setFilteredPGs(filtered);
  }, [locationFilter, categoryFilter, pgs]);

  return (
    <div>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 justify-end">
          <label className="text-lg font-semibold">Find your PG</label>

          <input
            type="text"
            placeholder="Search by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-64"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring w-full sm:w-48"
          >
            <option value="">All Categories</option>
            <option value="GIRLS">Girls</option>
            <option value="BOYS">Boys</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>

        {Array.isArray(filteredPGs) && filteredPGs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredPGs.map((pg) => (
              <div
                key={pg.pgId}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer group"
                onClick={() => navigate(`/pg/${pg.pgId}`)}
              >
                {/* Image Section */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={`http://localhost:8080/${pg.imagePath}`}
                    alt={pg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                      pg.status === "Available"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {pg.status}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col gap-3 bg-gradient-to-b from-white to-gray-50">
                  <h2 className="text-2xl font-extrabold text-gray-900 truncate">
                    {pg.name}
                  </h2>

                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FiMapPin className="text-blue-500" />
                    {pg.location}
                  </p>

                  <p className="text-xs font-medium text-gray-700 flex items-center gap-2">
                    <MdCategory className="text-purple-500" />
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">
                      {pg.pgType?.toLowerCase()}
                    </span>
                  </p>
                  <hr className="border-gray-200" />
                  <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                    {pg.description}
                  </p>

                  {/* Price */}
                  {pg.price && (
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-semibold text-blue-600">
                        ₹{pg.price} / month
                      </p>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          pg.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {pg.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No PGs found matching your criteria.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PGList;
