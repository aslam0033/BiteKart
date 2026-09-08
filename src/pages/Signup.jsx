import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
  UtensilsCrossed,
  X,
  XCircle,
} from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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
     PASSWORD STRENGTH
  ===================================================== */

  const passwordChecks = useMemo(() => {
    const password = formData.password;

    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [formData.password]);

  const passwordScore = Object.values(
    passwordChecks
  ).filter(Boolean).length;

  const getPasswordStrength = () => {
    if (!formData.password) {
      return {
        label: "",
        width: "0%",
        className: "bg-gray-200",
      };
    }

    if (passwordScore <= 2) {
      return {
        label: "Weak",
        width: "35%",
        className: "bg-red-500",
      };
    }

    if (passwordScore <= 4) {
      return {
        label: "Medium",
        width: "70%",
        className: "bg-yellow-500",
      };
    }

    return {
      label: "Strong",
      width: "100%",
      className: "bg-green-500",
    };
  };

  const passwordStrength =
    getPasswordStrength();

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

    if (!formData.email.trim()) {
      newErrors.email =
        "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.phone) {
      newErrors.phone =
        "Please enter your phone number.";
    } else if (
      !/^[6-9]\d{9}$/.test(formData.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.password) {
      newErrors.password =
        "Please create a password.";
    } else if (
      !Object.values(passwordChecks).every(
        Boolean
      )
    ) {
      newErrors.password =
        "Password must satisfy all requirements.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!acceptedTerms) {
      newErrors.terms =
        "Please accept the terms and privacy policy.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const users =
        JSON.parse(
          localStorage.getItem(
            "foodrush-users"
          )
        ) || [];

      const emailExists = users.some(
        (user) =>
          user.email?.toLowerCase() ===
          formData.email
            .trim()
            .toLowerCase()
      );

      if (
        formData.email
          .trim()
          .toLowerCase() ===
        "demo@foodrush.com"
      ) {
        setMessage({
          type: "error",
          text: "This email is already registered.",
        });

        setIsSubmitting(false);
        return;
      }

      if (emailExists) {
        setMessage({
          type: "error",
          text: "An account with this email already exists.",
        });

        setErrors((current) => ({
          ...current,
          email:
            "This email is already registered.",
        }));

        setIsSubmitting(false);
        return;
      }

      const newUser = {
        id: `USR${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        phone: formData.phone,
        password: formData.password,

        profilePhoto: "",
        address: "",
        landmark: "",
        city: "",
        pincode: "",

        createdAt:
          new Date().toISOString(),
      };

      const updatedUsers = [
        ...users,
        newUser,
      ];

      localStorage.setItem(
        "foodrush-users",
        JSON.stringify(updatedUsers)
      );

      const safeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        profilePhoto: "",
        address: "",
        landmark: "",
        city: "",
        pincode: "",
        createdAt: newUser.createdAt,
      };

      localStorage.setItem(
        "foodrush-current-user",
        JSON.stringify(safeUser)
      );

      window.dispatchEvent(
        new Event("authUpdated")
      );

      setMessage({
        type: "success",
        text: "Account created successfully. Welcome to FoodRush!",
      });

      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 600);
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong while creating your account.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1600px] lg:grid-cols-2">

        {/* =================================================
            LEFT
        ================================================= */}

        <section className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

          {/* LOGO */}
          <Link
            to="/"
            className="relative z-10 flex w-fit items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <UtensilsCrossed size={24} />
            </div>

            <h1 className="text-2xl font-extrabold text-white">
              Food
              <span className="text-orange-500">
                Rush
              </span>
            </h1>
          </Link>

          {/* CONTENT */}
          <div className="relative z-10 max-w-xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-orange-400">

              <Sparkles size={17} />

              Join FoodRush

            </div>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
              Great food starts with one simple account.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-400">
              Create your account to save dishes,
              manage orders and enjoy a smoother
              food ordering experience.
            </p>

            <div className="mt-10 space-y-5">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                  <Truck
                    size={20}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <p className="font-bold text-white">
                    Faster Ordering
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Keep your details ready for a
                    smoother checkout experience.
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                  <ShieldCheck
                    size={20}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <p className="font-bold text-white">
                    Personal Account
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Manage your profile, orders
                    and favorite meals in one place.
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                  <CheckCircle2
                    size={20}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <p className="font-bold text-white">
                    Easy to Use
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    Simple, responsive and designed
                    for a great ordering experience.
                  </p>
                </div>

              </div>

            </div>

          </div>

          <p className="relative z-10 text-sm text-gray-500">
            © 2026 FoodRush. All rights reserved.
          </p>

        </section>

        {/* =================================================
            SIGNUP FORM
        ================================================= */}

        <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12">

          <div className="w-full max-w-lg">

            {/* MOBILE LOGO */}
            <Link
              to="/"
              className="mb-9 flex w-fit items-center gap-2 lg:hidden"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                <UtensilsCrossed size={21} />
              </div>

              <h1 className="text-2xl font-extrabold">
                Food
                <span className="text-orange-500">
                  Rush
                </span>
              </h1>

            </Link>

            <p className="font-semibold text-orange-500">
              Create Account
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Join FoodRush today
            </h1>

            <p className="mt-3 leading-7 text-gray-500">
              Fill in your details and start ordering
              from your favorite restaurants.
            </p>

            {/* =================================================
                MESSAGE
            ================================================= */}

            {message.text && (
              <div
                className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
                  message.type === "success"
                    ? "border-green-100 bg-green-50 text-green-700"
                    : "border-red-100 bg-red-50 text-red-600"
                }`}
              >

                {message.type ===
                "success" ? (
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0"
                  />
                ) : (
                  <XCircle
                    size={20}
                    className="mt-0.5 shrink-0"
                  />
                )}

                <p className="text-sm leading-6">
                  {message.text}
                </p>

              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* FULL NAME */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <div
                  className={`flex items-center gap-3 rounded-xl border bg-white px-4 transition focus-within:border-orange-500 ${
                    errors.name
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                >

                  <UserRound
                    size={19}
                    className="shrink-0 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full bg-transparent py-3.5 outline-none"
                  />

                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.name}
                  </p>
                )}

              </div>

              {/* EMAIL */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div
                  className={`flex items-center gap-3 rounded-xl border bg-white px-4 transition focus-within:border-orange-500 ${
                    errors.email
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                >

                  <Mail
                    size={19}
                    className="shrink-0 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent py-3.5 outline-none"
                  />

                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* PHONE */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <div
                  className={`flex overflow-hidden rounded-xl border bg-white transition focus-within:border-orange-500 ${
                    errors.phone
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                >

                  <div className="flex items-center gap-2 border-r bg-gray-50 px-4 text-sm text-gray-500">

                    <Phone size={17} />

                    +91

                  </div>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    autoComplete="tel"
                    className="w-full px-4 py-3.5 outline-none"
                  />

                </div>

                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.phone}
                  </p>
                )}

              </div>

              {/* PASSWORD */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div
                  className={`flex items-center gap-3 rounded-xl border bg-white px-4 transition focus-within:border-orange-500 ${
                    errors.password
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                >

                  <LockKeyhole
                    size={19}
                    className="shrink-0 text-gray-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="w-full bg-transparent py-3.5 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="text-gray-400 transition hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}

                {/* STRENGTH BAR */}
                {formData.password && (
                  <div className="mt-4">

                    <div className="flex items-center justify-between">

                      <p className="text-xs text-gray-500">
                        Password strength
                      </p>

                      <p
                        className={`text-xs font-bold ${
                          passwordStrength.label ===
                          "Strong"
                            ? "text-green-600"
                            : passwordStrength.label ===
                              "Medium"
                            ? "text-yellow-600"
                            : "text-red-500"
                        }`}
                      >
                        {
                          passwordStrength.label
                        }
                      </p>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">

                      <div
                        style={{
                          width:
                            passwordStrength.width,
                        }}
                        className={`h-full rounded-full transition-all duration-300 ${passwordStrength.className}`}
                      />

                    </div>

                    {/* PASSWORD RULES */}
                    <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">

                      {[
                        {
                          label:
                            "At least 8 characters",
                          valid:
                            passwordChecks.length,
                        },
                        {
                          label:
                            "One uppercase letter",
                          valid:
                            passwordChecks.uppercase,
                        },
                        {
                          label:
                            "One lowercase letter",
                          valid:
                            passwordChecks.lowercase,
                        },
                        {
                          label:
                            "One number",
                          valid:
                            passwordChecks.number,
                        },
                        {
                          label:
                            "One special character",
                          valid:
                            passwordChecks.special,
                        },
                      ].map((rule) => (
                        <div
                          key={rule.label}
                          className={`flex items-center gap-2 ${
                            rule.valid
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >

                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded-full ${
                              rule.valid
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {rule.valid ? (
                              <Check size={11} />
                            ) : (
                              <X size={10} />
                            )}
                          </div>

                          {rule.label}

                        </div>
                      ))}

                    </div>

                  </div>
                )}

              </div>

              {/* CONFIRM PASSWORD */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>

                <div
                  className={`flex items-center gap-3 rounded-xl border bg-white px-4 transition focus-within:border-orange-500 ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                >

                  <LockKeyhole
                    size={19}
                    className="shrink-0 text-gray-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Enter password again"
                    autoComplete="new-password"
                    className="w-full bg-transparent py-3.5 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="text-gray-400 transition hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {
                      errors.confirmPassword
                    }
                  </p>
                )}

              </div>

              {/* TERMS */}
              <div>

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(
                        e.target.checked
                      );

                      setErrors(
                        (current) => ({
                          ...current,
                          terms: "",
                        })
                      );
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-orange-500"
                  />

                  <span className="text-sm leading-6 text-gray-600">
                    I agree to the{" "}
                    <span className="font-semibold text-orange-500">
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-orange-500">
                      Privacy Policy
                    </span>
                    .
                  </span>

                </label>

                {errors.terms && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.terms}
                  </p>
                )}

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {isSubmitting
                  ? "Creating Account..."
                  : "Create Account"}

                {!isSubmitting && (
                  <ArrowRight size={19} />
                )}

              </button>

            </form>

            {/* SECURITY */}
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">

              <ShieldCheck size={15} />

              Frontend demo account system

            </div>

            {/* LOGIN */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}

              <Link
                to="/login"
                className="font-bold text-orange-500 transition hover:text-orange-600"
              >
                Sign In
              </Link>
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Signup;