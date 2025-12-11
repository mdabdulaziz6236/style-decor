import React from "react";
import { Link } from "react-router";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#091635] text-gray-300 font-display border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* 1. Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg">
                S
              </div>
              <span className="text-2xl font-black text-white tracking-wide">
                StyleDecor
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed pr-4">
              Transforming spaces into timeless memories. We provide premium
              decoration services for weddings, corporate events, and smart
              homes.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {[
                {
                  icon: <FaFacebookF />,
                  color: "hover:bg-[#1877F2] hover:border-[#1877F2]",
                },
                {
                  icon: <FaTwitter />,
                  color: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]",
                },
                {
                  icon: <FaInstagram />,
                  color: "hover:bg-[#E4405F] hover:border-[#E4405F]",
                },
                {
                  icon: <FaLinkedinIn />,
                  color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2. Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b-2 border-primary/50 w-fit pb-1">
              Our Services
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "Wedding Decoration",
                "Corporate Events",
                "Smart Home Setup",
                "Birthday Parties",
                "Interior Design",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Company */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b-2 border-secondary/50 w-fit pb-1">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-secondary transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  to="/decorators"
                  className="hover:text-secondary transition-colors"
                >
                  Our Experts
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-secondary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-secondary transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-b-2 border-accent/50 w-fit pb-1">
              Contact Us
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-primary text-lg" />
                <span>
                  Level-4, 34, Awal Centre, <br /> Banani, Dhaka
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary" />
                <span className="hover:text-white cursor-pointer transition-colors">
                  +880 123 456 789
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary" />
                <span className="hover:text-white cursor-pointer transition-colors">
                  support@styledecor.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-white font-bold">StyleDecor</span>. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="hover:text-primary transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
