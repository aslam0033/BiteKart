import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Heart,
  LogOut,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Save,
  ShoppingBag,
  UserRound,
  WalletCards,
  XCircle,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("foodrush-current-user")
      );
    } catch {
      return null;
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => ({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    profilePhoto: currentUser?.profilePhoto || "",
    address: currentUser?.address || "",
    landmark: currentUser?.landmark || "",
    city: currentUser?.city || "",
    pincode: currentUser?.pincode || "",
  }));

  /* =====================================================
     ORDERS
  ===================================================== */

  const orders = useMemo(() => {
    if (!currentUser) return [];

    try {
      const allOrders =
        JSON.parse(
          localStorage.getItem("foodrush-orders")
        ) || [];

      return allOrders.filter(
        (order) =>
          order.customer?.email?.toLowerCase() ===
          currentUser.email?.toLowerCase()
      );
    } catch {
      return [];
    }
  }, [currentUser]);

  /* =====================================================
     WISHLIST
  ===================================================== */

  const wishlist = useMemo(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem(
            "foodrush-wishlist"
          )
        ) || []
      );
    } catch {
      return [];
    }
  }, []);

  /* =====================================================
     PROFILE STATS
  ===================================================== */

  const totalSpent = orders.reduce(
    (total, order) =>
      order.status !== "Cancelled"
        ? total + Number(order.total || 0)
        : total,
    0
  );

  const completedOrders = orders.filter(
    (order) =>
      order.status === "Delivered"
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      !["Delivered", "Cancelled"].includes(
        order.status
      )
  ).length;

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    if (name === "pincode") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }

    setFormData((current) => ({
      ...current,
      [name]: updatedValue,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setMessage({
      type: "",
      text: "",
    });
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Please enter your full name.";
    } else if (
      formData.name.trim().length < 3
    ) {
      newErrors.name =
        "Name must contain at least 3 characters.";
    }

    if (
      formData.phone &&
      !/^[6-9]\d{9}$/.test(formData.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (
      formData.pincode &&
      !/^\d{6}$/.test(formData.pincode)
    ) {
      newErrors.pincode =
        "Pincode must contain exactly 6 digits.";
    }

    if (
      formData.profilePhoto &&
      !/^https?:\/\/.+/i.test(
        formData.profilePhoto
      )
    ) {
      newErrors.profilePhoto =
        "Enter a valid image URL beginning with http or https.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  const saveProfile = () => {
    if (!validateForm()) return;

    const updatedCurrentUser = {
      ...currentUser,
      name: formData.name.trim(),
      phone: formData.phone,
      profilePhoto:
        formData.profilePhoto.trim(),
      address: formData.address.trim(),
      landmark: formData.landmark.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode,
    };

    localStorage.setItem(
      "foodrush-current-user",
      JSON.stringify(updatedCurrentUser)
    );

    try {
      const registeredUsers =
        JSON.parse(
          localStorage.getItem(
            "foodrush-users"
          )
        ) || [];

      const updatedUsers =
        registeredUsers.map((user) =>
          user.id === currentUser.id
            ? {
                ...user,
                name:
                  updatedCurrentUser.name,
                phone:
                  updatedCurrentUser.phone,
                profilePhoto:
                  updatedCurrentUser.profilePhoto,
                address:
                  updatedCurrentUser.address,
                landmark:
                  updatedCurrentUser.landmark,
                city:
                  updatedCurrentUser.city,
                pincode:
                  updatedCurrentUser.pincode,
              }
            : user
        );

      localStorage.setItem(
        "foodrush-users",
        JSON.stringify(updatedUsers)
      );
    } catch {
      // Keeps current user saved even if
      // registered-user data is unavailable.
    }

    setCurrentUser(updatedCurrentUser);

    window.dispatchEvent(
      new Event("authUpdated")
    );

    setIsEditing(false);

    setMessage({
      type: "success",
      text: "Profile updated successfully.",
    });

    setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 2500);
  };

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const cancelEdit = () => {
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      profilePhoto:
        currentUser?.profilePhoto || "",
      address: currentUser?.address || "",
      landmark: currentUser?.landmark || "",
      city: currentUser?.city || "",
      pincode: currentUser?.pincode || "",
    });

    setErrors({});
    setIsEditing(false);
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    localStorage.removeItem(
      "foodrush-current-user"
    );

    window.dispatchEvent(
      new Event("authUpdated")
    );

    navigate("/login", {
      replace: true,
    });
  };

  /* =====================================================
     USER NOT LOGGED IN
  ===================================================== */

  if (!currentUser) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6 py-16">

        <div className="w-full max-w-lg rounded-4xl bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">

            <UserRound
              size={42}
              className="text-orange-500"
            />

          </div>

          <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
            Sign in to view your profile
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            Login to manage your personal details,
            delivery address and account information.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            Sign In

            <ArrowRight size={18} />
          </button>

        </div>

      </section>
    );
  }

  /* =====================================================
     CREATED DATE
  ===================================================== */

  const createdDate =
    currentUser.createdAt
      ? new Date(
          currentUser.createdAt
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "FoodRush Member";

  const initials = currentUser.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =================================================
          MESSAGE
      ================================================= */}

      {message.text && (
        <div className="fixed right-5 top-24 z-100 flex max-w-[90%] items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-4 text-sm font-medium text-white shadow-2xl">

          {message.type === "success" ? (
            <CheckCircle2
              size={20}
              className="shrink-0 text-green-400"
            />
          ) : (
            <XCircle
              size={20}
              className="shrink-0 text-red-400"
            />
          )}

          {message.text}

        </div>
      )}

      {/* =================================================
          PROFILE HERO
      ================================================= */}

      <section className="bg-zinc-950">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* PROFILE IMAGE */}
              {currentUser.profilePhoto ? (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.name}
                  className="h-28 w-28 rounded-3xl border-4 border-white/10 object-cover shadow-xl"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-orange-500 text-3xl font-extrabold text-white shadow-xl">
                  {initials || "FR"}
                </div>
              )}

              <div>

                <p className="font-semibold text-orange-400">
                  My Profile
                </p>

                <h1 className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">
                  {currentUser.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">

                  <div className="flex items-center gap-2">
                    <Mail size={16} />

                    {currentUser.email}
                  </div>

                  {currentUser.phone && (
                    <div className="flex items-center gap-2">

                      <Phone size={16} />

                      +91 {currentUser.phone}

                    </div>
                  )}

                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">

                  <CalendarDays size={15} />

                  Member since {createdDate}

                </div>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              {!isEditing ? (
                <button
                  onClick={() =>
                    setIsEditing(true)
                  }
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  <Edit3 size={18} />

                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={cancelEdit}
                    className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveProfile}
                    className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                  >
                    <Save size={18} />

                    Save Changes
                  </button>
                </>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-red-500/40 px-5 py-3 font-semibold text-red-400 transition hover:bg-red-500/10"
              >
                <LogOut size={18} />

                Logout
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          STATS
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                <ShoppingBag
                  size={20}
                  className="text-orange-500"
                />
              </div>

              <span className="text-2xl font-extrabold">
                {orders.length}
              </span>

            </div>

            <p className="mt-5 text-sm text-gray-500">
              Total Orders
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                <PackageCheck
                  size={20}
                  className="text-green-600"
                />
              </div>

              <span className="text-2xl font-extrabold">
                {completedOrders}
              </span>

            </div>

            <p className="mt-5 text-sm text-gray-500">
              Delivered Orders
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100">
                <Heart
                  size={20}
                  className="text-red-500"
                />
              </div>

              <span className="text-2xl font-extrabold">
                {wishlist.length}
              </span>

            </div>

            <p className="mt-5 text-sm text-gray-500">
              Favorite Foods
            </p>

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <WalletCards
                  size={20}
                  className="text-purple-600"
                />
              </div>

              <span className="text-2xl font-extrabold">
                ₹{totalSpent}
              </span>

            </div>

            <p className="mt-5 text-sm text-gray-500">
              Total Spent
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN PROFILE CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        <div className="grid gap-7 lg:grid-cols-[1fr_330px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-7">

            {/* PERSONAL DETAILS */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">

                  <UserRound
                    size={20}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Personal Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    Manage your account details.
                  </p>

                </div>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* NAME */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      errors.name
                        ? "border-red-400"
                        : isEditing
                        ? "border-gray-200 bg-white focus:border-orange-500"
                        : "border-gray-100 bg-gray-50 text-gray-600"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}

                </div>

                {/* PHONE */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <div
                    className={`flex overflow-hidden rounded-xl border ${
                      errors.phone
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >

                    <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                      +91
                    </span>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="9876543210"
                      className={`w-full px-4 py-3 outline-none ${
                        isEditing
                          ? "bg-white"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    />

                  </div>

                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phone}
                    </p>
                  )}

                </div>

                {/* EMAIL */}
                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4">

                    <Mail
                      size={18}
                      className="text-gray-400"
                    />

                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-transparent py-3 text-gray-500 outline-none"
                    />

                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Email cannot be changed in this frontend demo.
                  </p>

                </div>

                {/* PROFILE IMAGE */}
                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-semibold">
                    Profile Image URL
                  </label>

                  <input
                    type="text"
                    name="profilePhoto"
                    value={
                      formData.profilePhoto
                    }
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://example.com/photo.jpg"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      errors.profilePhoto
                        ? "border-red-400"
                        : isEditing
                        ? "border-gray-200 bg-white focus:border-orange-500"
                        : "border-gray-100 bg-gray-50 text-gray-600"
                    }`}
                  />

                  {errors.profilePhoto && (
                    <p className="mt-1 text-xs text-red-500">
                      {
                        errors.profilePhoto
                      }
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* DELIVERY ADDRESS */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-7 flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">

                  <MapPin
                    size={20}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    Saved Delivery Address
                  </h2>

                  <p className="text-sm text-gray-500">
                    Keep your address ready for faster checkout.
                  </p>

                </div>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* ADDRESS */}
                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-semibold">
                    Address
                  </label>

                  <textarea
                    name="address"
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="House number, street, area..."
                    className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-gray-200 bg-white focus:border-orange-500"
                        : "border-gray-100 bg-gray-50 text-gray-600"
                    }`}
                  />

                </div>

                {/* LANDMARK */}
                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-semibold">
                    Landmark
                  </label>

                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Near college, hospital, etc."
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-gray-200 bg-white focus:border-orange-500"
                        : "border-gray-100 bg-gray-50 text-gray-600"
                    }`}
                  />

                </div>

                {/* CITY */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Jamkhandi"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      isEditing
                        ? "border-gray-200 bg-white focus:border-orange-500"
                        : "border-gray-100 bg-gray-50 text-gray-600"
                    }`}
                  />

                </div>

                {/* PINCODE */}
                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="587301"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      errors.pincode
                        ? "border-red-400"
                        : isEditing
                        ? "border-gray-200 bg-white focus:border-orange-500"
                        : "border-gray-100 bg-gray-50 text-gray-600"
                    }`}
                  />

                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.pincode}
                    </p>
                  )}

                </div>

              </div>

              {isEditing && (
                <button
                  onClick={saveProfile}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white transition hover:bg-orange-600 sm:w-auto sm:px-7"
                >
                  <Save size={18} />

                  Save Profile
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <aside className="h-fit space-y-5 lg:sticky lg:top-24">

            {/* ACCOUNT */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h3 className="font-bold">
                Account Overview
              </h3>

              <div className="mt-6 space-y-5">

                <div className="flex justify-between gap-3">

                  <span className="text-sm text-gray-500">
                    Account ID
                  </span>

                  <span className="max-w-40 truncate text-sm font-semibold">
                    {currentUser.id}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-sm text-gray-500">
                    Active Orders
                  </span>

                  <span className="font-bold text-orange-500">
                    {activeOrders}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-sm text-gray-500">
                    Completed
                  </span>

                  <span className="font-bold text-green-600">
                    {completedOrders}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-sm text-gray-500">
                    Wishlist
                  </span>

                  <span className="font-bold">
                    {wishlist.length}
                  </span>

                </div>

              </div>

            </div>

            {/* QUICK LINKS */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h3 className="font-bold">
                Quick Actions
              </h3>

              <div className="mt-5 space-y-3">

                <button
                  onClick={() =>
                    navigate("/orders")
                  }
                  className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5 text-left transition hover:bg-orange-50"
                >

                  <div className="flex items-center gap-3">

                    <PackageCheck
                      size={19}
                      className="text-orange-500"
                    />

                    <span className="text-sm font-semibold">
                      My Orders
                    </span>

                  </div>

                  <ArrowRight size={17} />

                </button>

                <button
                  onClick={() =>
                    navigate("/wishlist")
                  }
                  className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5 text-left transition hover:bg-orange-50"
                >

                  <div className="flex items-center gap-3">

                    <Heart
                      size={19}
                      className="text-red-500"
                    />

                    <span className="text-sm font-semibold">
                      Wishlist
                    </span>

                  </div>

                  <ArrowRight size={17} />

                </button>

                <button
                  onClick={() =>
                    navigate("/restaurants")
                  }
                  className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5 text-left transition hover:bg-orange-50"
                >

                  <div className="flex items-center gap-3">

                    <ShoppingBag
                      size={19}
                      className="text-orange-500"
                    />

                    <span className="text-sm font-semibold">
                      Order Food
                    </span>

                  </div>

                  <ArrowRight size={17} />

                </button>

              </div>

            </div>

            {/* MEMBER CARD */}
            <div className="rounded-3xl bg-orange-500 p-6 text-white">

              <p className="text-sm font-semibold text-orange-100">
                FOODRUSH MEMBER
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Thanks for being with us!
              </h3>

              <p className="mt-3 text-sm leading-6 text-orange-100">
                Keep exploring restaurants and save
                your favorite dishes for faster ordering.
              </p>

            </div>

          </aside>

        </div>

      </section>

    </div>
  );
}

export default Profile;