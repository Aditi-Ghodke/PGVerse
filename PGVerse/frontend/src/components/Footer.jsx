// import React from "react";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-gray-300 py-7 px-6">
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
//         <div className="flex flex-col md:flex-row items-center md:items-start gap-20">
//           <img
//             src="/images/logo/footerLogo.png"
//             alt="PGVerse Logo"
//             className="h-20"
//           />
//           <div>
//             <h3 className="text-3xl font-extrabold text-white mb-1">PGVerse</h3>
//             <p className="text-sm text-gray-400 max-w-lg">
//               Simplifying your PG hunt — find, compare, and book verified PG
//               accommodations easily.
//             </p>
//           </div>
//         </div>

//         <div className="mt-6 md:mt-0 text-center md:text-center w-full">
//           <h4 className="text-lg font-semibold text-white mb-2">Quick Links</h4>
//           <ul className="space-y-1 text-sm text-gray-400">
//             <li>
//               <a href="/" className="hover:underline">
//                 Home
//               </a>
//             </li>
//             <li>
//               <a href="/home" className="hover:underline">
//                 View PGs
//               </a>
//             </li>
//             <li>
//               <a href="/about" className="hover:underline">
//                 About
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//       <div className="text-center text-xs text-gray-500 mt-10 border-t border-gray-700 pt-4">
//         © 2025 PGVerse. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-7 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">PGVerse</h3>
          <p className="text-sm text-gray-400 max-w-sm">
            Simplifying your PG hunt — find, compare, and book verified PG //
            accommodations easily.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/pglist" className="hover:underline">
                View PG
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h4 className="text-lg font-semibold text-white mb-3">Contact Us</h4>
          <p className="text-sm text-gray-400 mb-3">
            Email: support@pgverse.com
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaSquareXTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-4">
        © 2025 PlayArena. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
