import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import WorkSection from "../components/WorkSection";
import Footer from "../components/Footer";

const bannerImages = [
  "/images/bannerImages/img1.png",
  "/images/bannerImages/img2.png",
  "/images/bannerImages/img3.png",
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="font-sans">
      {/* Navbar */}
      {/* <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-blue-600">PGVerse</h1>
        <button
          onClick={() => navigate("/home")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Explore
        </button>
      </nav> */}

      {/* Slideshow Banner */}
      <div className="p-20">
        <div className="relative w-full max-w-8xl mx-auto h-[60vh] rounded-xl overflow-hidden shadow-lg">
          {bannerImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`slide-${index}`}
              className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`transition-all duration-300 ${
                  index === currentImage
                    ? "w-20 h-3 rounded-md bg-indigo-600"  // Rectangle for active slide
                    : "w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400"  // Circle for inactive
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

       
      </div>

      {/* Description Section */}
      <div className="px-20">
        <div className=" flex flex-col md:flex-row items-center rounded-xl gap-6 px-8 py-12 shadow-lg">
          <img
            src="/images/bannerImages/info.png"
            alt="info"
            className="w-full md:w-1/3 rounded shadow"
          />
            <p className="text-xl text-center leading-relaxed text-gray-700 md:w-2/3">
              PGVerse helps you find, compare, and book PG accommodations with ease.
              Whether you're a student or working professional, our platform connects
              you with verified PGs with real reviews, transparent pricing, and convenient booking.
              Enjoy hassle-free experiences with detailed listings, real-time availability, and secure online bookings.
              Say goodbye to endless site visits and negotiations—PGVerse brings everything you need into one simple, user-friendly platform.
            </p>
        </div> 
      </div>


      {/* Reviews Carousel */}
      {/* <div className="px-8 py-12">
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
      </div> */}
      <WorkSection/>
      <Footer/>
    </div>
    
  );
};


export default LandingPage;
