import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useClerk, UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useAppContext } from "../context/useAppContext";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Experience", path: "/experience" },
    { name: "About", path: "/about" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const { openSignIn } = useClerk();
  const { navigate, isAdmin } = useAppContext();

  // Scroll effect
  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* LOGO */}
      <Link to="/" className="shrink-0">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled ? "invert opacity-80" : "opacity-95"}`}
        />
      </Link>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((navLink) => (
          <NavLink
            key={navLink.name}
            to={navLink.path}
            className={({ isActive }) =>
              `cursor-pointer relative pb-1 text-[15px] transition-colors ${
                isScrolled ? "text-gray-700" : "text-white"
              } ${isActive ? "font-semibold border-b-2 border-black" : "border-b-2 border-transparent"}`
            }
          >
            {navLink.name}
          </NavLink>
        ))}

        {/* LOGGED IN */}
        <SignedIn>
          <button
            className={`cursor-pointer border px-4 py-1 rounded-full ${
              isScrolled ? "text-black" : "text-white"
            }`}
            onClick={() => navigate(isAdmin ? "/owner" : "/my-bookings")}
          >
            Dashboard
          </button>
        </SignedIn>
      </div>

      {/* DESKTOP RIGHT */}
      <div className="hidden md:flex items-center gap-4">
        <SignedIn>
          <UserButton />
        </SignedIn>

        <SignedOut>
          <button
            onClick={openSignIn}
            className="cursor-pointer bg-black text-white px-8 py-2.5 rounded-full"
          >
            Login
          </button>
        </SignedOut>
      </div>

      {/* MOBILE */}
      <div className="flex items-center gap-3 md:hidden">
        <SignedIn>
          <UserButton />
        </SignedIn>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex items-center justify-center h-9 w-9 rounded-md border transition-colors ${
            isScrolled
              ? "border-gray-300 bg-white text-gray-800"
              : "border-white/40 bg-black/25 text-white"
          }`}
        >
          {isMenuOpen ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

    </nav>

    {/* MOBILE MENU */}
    <div
      className={`fixed inset-0 z-[999] w-full h-screen bg-white flex flex-col items-center justify-center gap-6 md:hidden transition-all duration-300 px-6 text-center overflow-y-auto ${
        isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <Link to="/" onClick={() => setIsMenuOpen(false)} className="absolute top-4 left-4">
        <img src={assets.logo} alt="logo" className="h-8 invert opacity-80" />
      </Link>

      <button
        className="absolute top-4 right-4 cursor-pointer"
        onClick={() => setIsMenuOpen(false)}
      >
        ✕
      </button>

      {navLinks.map((navLink) => (
        <NavLink
          key={navLink.name}
          to={navLink.path}
          className={({ isActive }) => `cursor-pointer text-xl font-bold tracking-wide ${isActive ? 'text-black' : 'text-gray-700'}`}
          onClick={() => setIsMenuOpen(false)}
        >
          {navLink.name}
        </NavLink>
      ))}

      <SignedIn>
        <div className="flex flex-col items-center gap-6">
          <button
            className="cursor-pointer border px-5 py-2 rounded-full text-base font-medium"
            onClick={() => {
              navigate(isAdmin ? "/owner" : "/my-bookings");
              setIsMenuOpen(false);
            }}
          >
            Dashboard
          </button>
        </div>
      </SignedIn>

      <SignedOut>
        <button
          onClick={() => {
            setIsMenuOpen(false);
            openSignIn();
          }}
          className="cursor-pointer bg-black text-white px-8 py-2.5 rounded-full"
        >
          Login
        </button>
      </SignedOut>
    </div>
    </>
  );
};

export default Navbar;
