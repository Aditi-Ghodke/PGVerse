import React from 'react';
import { FaMapMarkedAlt, FaClipboardCheck, FaBed, FaUserShield } from 'react-icons/fa';

const WorkSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-1 text-center">
        <h2 className="text-3xl font-bold mb-10 text-indigo-700">How PGVerse Works</h2>

        <div className="grid md:grid-cols-4 gap-9">

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-xl transition">
            <FaMapMarkedAlt className="text-indigo-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Search PGs</h3>
            <p>Discover PGs near your desired location with filters for price, gender, and amenities.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-xl transition">
            <FaClipboardCheck className="text-indigo-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compare & Book</h3>
            <p>Compare PG listings, check reviews and photos, and make an informed decision.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-xl transition">
            <FaBed className="text-indigo-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Move In Easily</h3>
            <p>Secure your spot and move in without paperwork hassles or last-minute issues.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow hover:shadow-xl transition">
            <FaUserShield className="text-indigo-600 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verified Support</h3>
            <p>Get expert assistance anytime with our verified owner and support team.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkSection;
