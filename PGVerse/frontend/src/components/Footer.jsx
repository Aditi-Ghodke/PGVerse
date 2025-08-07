import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
        
        {/* Left: Logo + Branding */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-20">
          <img src="/images/logo/footerLogo.png" alt="PGVerse Logo" className="h-20" />
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-1">PGVerse</h3>
            <p className="text-sm text-gray-400 max-w-lg">
        
              Simplifying your PG hunt — find, compare, and book verified PG accommodations easily.
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-0 text-center md:text-center w-full">
        <h4 className="text-lg font-semibold text-white mb-2">Quick Links</h4>
        <ul className="space-y-1 text-sm text-gray-400">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li><a href="/home" className="hover:underline">View PGs</a></li>
        <li><a href="/about" className="hover:underline">About</a></li>
        </ul>

        </div>


      </div>

      {/* Bottom Line */}
      <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-700 pt-4">
        © 2025 PGVerse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

