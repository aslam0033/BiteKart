import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MapPin,
  Phone,
  UtensilsCrossed,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-zinc-950 text-gray-300">

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* About */}
        <div>
          <Link to="/" className="mb-5 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <UtensilsCrossed size={21} />
            </div>

            <h2 className="text-2xl font-bold text-white">
              Food<span className="text-orange-500">Rush</span>
            </h2>
          </Link>

          <p className="leading-7 text-gray-400">
            Delicious meals from your favorite restaurants delivered directly
            to your doorstep.
          </p>

          <div className="mt-6 flex gap-3">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 transition hover:bg-orange-500"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 transition hover:bg-orange-500"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 transition hover:bg-orange-500"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3 text-gray-400">
            <Link to="/" className="hover:text-orange-500">
              Home
            </Link>

            <Link to="/restaurants" className="hover:text-orange-500">
              Restaurants
            </Link>

            <Link to="/menu" className="hover:text-orange-500">
              Food Menu
            </Link>

            <Link to="/orders" className="hover:text-orange-500">
              My Orders
            </Link>
          </div>
        </div>

        {/* Customer */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Customer
          </h3>

          <div className="flex flex-col gap-3 text-gray-400">
            <Link to="/cart" className="hover:text-orange-500">
              Cart
            </Link>

            <Link to="/wishlist" className="hover:text-orange-500">
              Wishlist
            </Link>

            <Link to="/profile" className="hover:text-orange-500">
              My Profile
            </Link>

            <Link to="/login" className="hover:text-orange-500">
              Login
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-semibold text-white">
            Contact Us
          </h3>

          <div className="space-y-4 text-gray-400">

            <div className="flex gap-3">
              <MapPin className="shrink-0 text-orange-500" size={20} />
              <p>Jamkhandi, Karnataka, India</p>
            </div>

            <div className="flex gap-3">
              <Phone className="text-orange-500" size={19} />
              <p>+91 98765 43210</p>
            </div>

            <div className="flex gap-3">
              <Mail className="text-orange-500" size={19} />
              <p>support@foodrush.com</p>
            </div>

          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-5 text-center text-sm text-gray-500">
        © 2026 FoodRush. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;