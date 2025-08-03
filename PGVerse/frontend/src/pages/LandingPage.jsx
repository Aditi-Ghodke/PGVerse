import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-blue-600">PGVerse</h1>
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Explore
        </button>
      </nav>

      {/* Banner */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src="../../public/images/bannerImages/city.jpg"
          alt="banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0  flex items-center justify-center text-white text-4xl font-semibold">
          Find Your Perfect Stay
        </div>
      </div>

      {/* Description Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 px-8 py-12 bg-gray-100">
        <img
          src="/info.jpg"
          alt="info"
          className="w-full md:w-1/3 rounded shadow"
        />
        <p className="text-lg leading-relaxed text-gray-700 md:w-2/3">
          PGVerse helps you find, compare, and book PG accommodations with ease.
          Whether you're a student or working professional, our platform connects
          you with verified PGs with real reviews, transparent pricing, and convenient booking.
        </p>
      </div>

      {/* Reviews Carousel */}
      <div className="px-8 py-12">
        <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
        <div className="flex overflow-x-auto gap-4">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div
              key={i}
              className="min-w-[300px] bg-white p-4 rounded shadow flex-shrink-0"
            >
              <p className="text-gray-600 italic">"Great PG experience!"</p>
              <p className="mt-2 font-bold">- User {i + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
