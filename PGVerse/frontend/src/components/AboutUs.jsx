import Footer from "./Footer";
const AboutUsSection = () => {
  return (
    <div>
      <div className="bg-white py-24 px-8 md:px-24 space-y-32 ">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-900">
            <span className="text-indigo-600">About</span> Us
          </h1>
          <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto">
            Discover what makes PGVerse more than just a PG platform — it’s a
            community, a solution, and your trusted companion in finding the
            perfect place to call home.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-14">
          <div className="md:w-1/2">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              We didn’t find it for us,
              <br />
              <span className="text-indigo-600 font-extrabold">
                so we created it for you
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              That’s essentially our story in one sentence. <br />
              Crammed-up hostels or cooped-up PGs — not much of a choice, right?
              That’s why we created PGVerse — a platform designed by people
              who've been in your shoes, who understand your needs and
              priorities, and who are inspired to make your living experience
              better, safer, and more comfortable every day.
              <br />
              <br />
              We believe in transparency, quality, and community, making sure
              every listing is verified and every stay feels like home.
            </p>
          </div>

          <div className="md:w-1/2 max-w-2xl mx-auto">
            <img
              src="/images/aboutUs/about1.png"
              alt="PG Room"
              className="rounded-2xl shadow-lg w-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center gap-14">
          <div className="md:w-1/2 max-w-2xl mx-auto">
            <img
              src="/images/aboutUs/about2.png"
              alt="Comfort Living"
              className="rounded-3xl shadow-xl w-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Say goodbye to compromises,
              <br />
              <span className="text-indigo-600 font-extrabold">
                and hello to comfort
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              With PGVerse, you don’t have to settle — you get to choose.
              Explore rooms tailored to your lifestyle and budget. Our
              amenities, transparent pricing, and verified listings guarantee a
              hassle-free, secure, and satisfying PG experience.
              <br />
              <br />
              Whether you’re a student or a working professional, comfort and
              convenience come first.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-14">
          <div className="md:w-1/2">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              More than a platform,
              <br />
              <span className="text-indigo-600 font-extrabold">
                it's your next home
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              From student life to working professionals, PGVerse is built for
              everyone. Browse through real photos, read honest reviews, and
              book with confidence. No more running around or worrying about
              hidden fees — your perfect PG is just a few clicks away.
              <br />
              <br />
              Join our community and experience a new way to find your home away
              from home.
            </p>
          </div>
          <div className="md:w-1/2 max-w-2xl mx-auto">
            <img
              src="/images/aboutUs/about3.png"
              alt="Next Home"
              className="rounded-3xl shadow-xl w-full transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsSection;
