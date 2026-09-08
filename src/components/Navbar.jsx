import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  PackageCheck,
  ShoppingCart,
  UserRound,
  UtensilsCrossed,
  X,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const profileMenuRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("foodrush-current-user")
      );
    } catch {
      return null;
    }
  });

  /* =====================================================
     CART COUNT
  ===================================================== */

  const updateCartCount = () => {
    try {
      const cart =
        JSON.parse(
          localStorage.getItem("foodrush-cart")
        ) || [];

      const count = cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  /* =====================================================
     AUTH USER
  ===================================================== */

  const updateCurrentUser = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem(
          "foodrush-current-user"
        )
      );

      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    }
  };

  /* =====================================================
     LISTEN FOR CHANGES
  ===================================================== */

  useEffect(() => {
    updateCartCount();
    updateCurrentUser();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    const handleAuthUpdate = () => {
      updateCurrentUser();
    };

    const handleStorage = () => {
      updateCartCount();
      updateCurrentUser();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    window.addEventListener(
      "authUpdated",
      handleAuthUpdate
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );

      window.removeEventListener(
        "authUpdated",
        handleAuthUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* =====================================================
     CLOSE MENUS ON ROUTE CHANGE
  ===================================================== */

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /* =====================================================
     CLOSE PROFILE MENU WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "foodrush-current-user"
    );

    setCurrentUser(null);
    setProfileOpen(false);
    setMobileOpen(false);

    window.dispatchEvent(
      new Event("authUpdated")
    );

    navigate("/");
  };

  /* =====================================================
     INITIALS
  ===================================================== */

  const initials = currentUser?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  /* =====================================================
     NAVLINK STYLE
  ===================================================== */

  const navLinkClass = ({ isActive }) =>
    `relative font-medium transition ${
      isActive
        ? "text-orange-500"
        : "text-gray-700 hover:text-orange-500"
    }`;

  return (
    <nav className="sticky top-0 z-90 border-b border-gray-100 bg-white/95 backdrop-blur-lg">

      <div className="mx-auto flex h-19 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <UtensilsCrossed size={21} />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Food
            <span className="text-orange-500">
              Rush
            </span>
          </h1>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <div className="hidden items-center gap-8 lg:flex">

          <NavLink
            to="/"
            end
            className={navLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/restaurants"
            className={navLinkClass}
          >
            Restaurants
          </NavLink>

          <NavLink
            to="/menu"
            className={navLinkClass}
          >
            Menu
          </NavLink>

          <NavLink
            to="/orders"
            className={navLinkClass}
          >
            Orders
          </NavLink>

        </div>

        {/* =================================================
            DESKTOP ACTIONS
        ================================================= */}

        <div className="hidden items-center gap-3 lg:flex">

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-red-50 hover:text-red-500"
            title="Wishlist"
          >
            <Heart size={21} />
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition hover:bg-orange-100"
            title="Cart"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-bold text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}
          </Link>

          {/* =============================================
              LOGGED OUT
          ============================================= */}

          {!currentUser ? (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              <UserRound size={18} />

              Login
            </Link>
          ) : (
            /* =============================================
               LOGGED IN PROFILE
            ============================================= */

            <div
              ref={profileMenuRef}
              className="relative"
            >

              <button
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-2 py-2 pr-3 transition hover:border-orange-200 hover:bg-orange-50"
              >

                {/* PHOTO / INITIALS */}
                {currentUser.profilePhoto ? (
                  <img
                    src={
                      currentUser.profilePhoto
                    }
                    alt={
                      currentUser.name
                    }
                    className="h-9 w-9 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white">
                    {initials || "FR"}
                  </div>
                )}

                <div className="max-w-30 text-left">

                  <p className="truncate text-xs text-gray-400">
                    Welcome
                  </p>

                  <p className="truncate text-sm font-bold text-gray-800">
                    {currentUser.name}
                  </p>

                </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>

              {/* PROFILE DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">

                  {/* USER INFO */}
                  <div className="border-b bg-gray-50 px-5 py-4">

                    <p className="truncate font-bold text-gray-900">
                      {currentUser.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {currentUser.email}
                    </p>

                  </div>

                  <div className="p-2">

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
                    >
                      <UserRound size={18} />

                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-orange-50 hover:text-orange-500"
                    >
                      <PackageCheck
                        size={18}
                      />

                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Heart size={18} />

                      Wishlist
                    </Link>

                  </div>

                  <div className="border-t p-2">

                    <button
                      onClick={
                        handleLogout
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />

                      Logout
                    </button>

                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* =================================================
            MOBILE ACTIONS
        ================================================= */}

        <div className="flex items-center gap-2 lg:hidden">

          {/* CART MOBILE */}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500"
          >
            <ShoppingCart size={20} />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-[9px] font-bold text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}
          </Link>

          {/* MENU BUTTON */}
          <button
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition hover:bg-gray-200"
          >
            {mobileOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

      </div>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">

          <div className="mx-auto max-w-7xl px-5 py-5">

            {/* =============================================
                USER INFO MOBILE
            ============================================= */}

            {currentUser && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl bg-orange-50 p-4">

                {currentUser.profilePhoto ? (
                  <img
                    src={
                      currentUser.profilePhoto
                    }
                    alt={
                      currentUser.name
                    }
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white">
                    {initials || "FR"}
                  </div>
                )}

                <div className="min-w-0">

                  <p className="truncate font-bold text-gray-900">
                    {currentUser.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {currentUser.email}
                  </p>

                </div>

              </div>
            )}

            {/* =============================================
                MOBILE NAV LINKS
            ============================================= */}

            <div className="space-y-1">

              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 font-semibold transition ${
                    isActive
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/restaurants"
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 font-semibold transition ${
                    isActive
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Restaurants
              </NavLink>

              <NavLink
                to="/menu"
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 font-semibold transition ${
                    isActive
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Menu
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 font-semibold transition ${
                    isActive
                      ? "bg-orange-50 text-orange-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Orders
              </NavLink>

              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${
                    isActive
                      ? "bg-red-50 text-red-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Heart size={18} />

                Wishlist
              </NavLink>

            </div>

            {/* =============================================
                MOBILE ACCOUNT
            ============================================= */}

            <div className="mt-5 border-t pt-5">

              {!currentUser ? (
                <div className="grid grid-cols-2 gap-3">

                  <Link
                    to="/login"
                    className="rounded-xl border border-orange-500 py-3 text-center text-sm font-bold text-orange-500"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="rounded-xl bg-orange-500 py-3 text-center text-sm font-bold text-white"
                  >
                    Sign Up
                  </Link>

                </div>
              ) : (
                <div className="space-y-2">

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 font-semibold text-gray-700"
                  >
                    <UserRound
                      size={18}
                    />

                    My Profile
                  </Link>

                  <button
                    onClick={
                      handleLogout
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut
                      size={18}
                    />

                    Logout
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </nav>
  );
}

export default Navbar;