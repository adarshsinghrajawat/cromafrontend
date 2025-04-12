import React from 'react';
//import { FaYoutube, FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from '@mui/icons-material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        <div className="mb-6 md:mb-0">
          <h3 className="text-lg font-bold mb-4">CONNECT WITH US</h3>
          <input
            type="email"
            placeholder="Enter Email ID"
            className="bg-gray-800 border-gray-700 text-gray-400 px-4 py-2 rounded-md w-full mb-4"
          />
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <YouTubeIcon size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FacebookIcon size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <InstagramIcon size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <LinkedInIcon size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <TwitterIcon size={24} />
            </a>
          </div>
        </div>
        {/* Add other sections of the footer here */}
        <div className="text-gray-400 text-sm mt-8 md:mt-0">
          &copy; Copyright {new Date().getFullYear()} Croma. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;


