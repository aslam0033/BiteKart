import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath =
    location.state?.from?.pathname || "/";

  /* =====================================================
     DEMO USER
  ===================================================== */

  const demoUser = {
    id: "demo-user-001",
    name: "FoodRush User",
    email: "demo@foodrush.com",
    phone: "9876543210",
    password: "FoodRush@123",
    createdAt: new Date().toISOString(),
  };

  /* =====================================================
     LOAD REMEMBERED EMAIL
  ===================================================== */

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(
      "foodrush-remembered-email"
    );

    if (rememberedEmail) {
      setFormData((current) => ({
        ...current,
        email: rememberedEmail,
      }));

      setRememberMe(true);
    }
  }, []);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
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

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const storedUsers =
        JSON.parse(
          localStorage.getItem("foodrush-users")
        ) || [];

      const allUsers = [demoUser, ...storedUsers];

      const user = allUsers.find(
        (storedUser) =>
          storedUser.email?.toLowerCase() ===
            formData.email.trim().toLowerCase() &&
          storedUser.password === formData.password
      );

      if (!user) {
        setMessage({
          type: "error",
          text: "Invalid email or password. Please check your credentials.",
        });

        setIsSubmitting(false);
        return;
      }

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        profilePhoto: user.profilePhoto || "",
        address: user.address || "",
        city: user.city || "",
        pincode: user.pincode || "",
        createdAt: user.createdAt,
      };

      localStorage.setItem(
        "foodrush-current-user",
        JSON.stringify(safeUser)
      );

      if (rememberMe) {
        localStorage.setItem(
          "foodrush-remembered-email",
          formData.email.trim()
        );
      } else {
        localStorage.removeItem(
          "foodrush-remembered-email"
        );
      }

      window.dispatchEvent(
        new Event("authUpdated")
      );

      setMessage({
        type: "success",
        text: `Welcome back, ${safeUser.name}!`,
      });

      setTimeout(() => {
        navigate(redirectPath, {
          replace: true,
        });
      }, 500);
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong while signing in.",
      });
    }

    setIsSubmitting(false);
  };

  /* =====================================================
     DEMO LOGIN
  ===================================================== */

  const fillDemoAccount = () => {
    setFormData({
      email: demoUser.email,
      password: demoUser.password,
    });

    setErrors({});

    setMessage({
      type: "",
      text: "",
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">

      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1600px] lg:grid-cols-2">

        {/* =================================================
            LEFT BRAND SECTION
        ================================================= */}

        <section className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">

          {/* DECORATION */}
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />

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

          {/* MAIN CONTENT */}
          <div className="relative z-10 max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-orange-400">
              <Sparkles size={17} />
              Welcome back
            </div>

            <h2 className="text-4xl font-extrabold leading-tight text-white xl:text-5xl">
              Your favorite food is only a few clicks away.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-400">
              Sign in to manage your orders, save your
              favorite dishes and enjoy a faster checkout
              experience.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <ShoppingBag className="text-orange-500" />

                <p className="mt-4 font-bold text-white">
                  Easy Ordering
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Order your favorite meals quickly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Truck className="text-orange-500" />

                <p className="mt-4 font-bold text-white">
                  Track Orders
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Follow your delivery status.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <ShieldCheck className="text-orange-500" />

                <p className="mt-4 font-bold text-white">
                  Secure
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Your account information stays safe.
                </p>
              </div>

            </div>

          </div>

          <p className="relative z-10 text-sm text-gray-500">
            © 2026 FoodRush. Delicious food, delivered fast.
          </p>

        </section>

        {/* =================================================
            LOGIN SECTION
        ================================================= */}

        <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <Link
              to="/"
              className="mb-10 flex w-fit items-center gap-2 lg:hidden"
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
              Welcome Back
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Sign in to your account
            </h1>

            <p className="mt-3 leading-7 text-gray-500">
              Enter your credentials to continue ordering
              delicious food.
            </p>

            {/* =============================================
                MESSAGE
            ============================================= */}

            {message.text && (
              <div
                className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
                  message.type === "success"
                    ? "border-green-100 bg-green-50 text-green-700"
                    : "border-red-100 bg-red-50 text-red-600"
                }`}
              >
                {message.type === "success" ? (
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

            {/* =============================================
                LOGIN FORM
            ============================================= */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

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

              {/* PASSWORD */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-sm font-semibold text-orange-500 transition hover:text-orange-600"
                    onClick={() => {
                      setMessage({
                        type: "error",
                        text: "Password reset requires a backend/email service, so it is not enabled in this frontend demo.",
                      });
                    }}
                  >
                    Forgot Password?
                  </button>

                </div>

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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

              </div>

              {/* REMEMBER */}
              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 accent-orange-500"
                />

                <span className="text-sm text-gray-600">
                  Remember my email
                </span>

              </label>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Signing In..."
                  : "Sign In"}

                {!isSubmitting && (
                  <ArrowRight size={19} />
                )}
              </button>

            </form>

            {/* =============================================
                DIVIDER
            ============================================= */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Demo Access
              </span>

              <div className="h-px flex-1 bg-gray-200" />

            </div>

            {/* DEMO LOGIN */}
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                  <ShieldCheck
                    size={19}
                    className="text-orange-500"
                  />
                </div>

                <div className="flex-1">

                  <p className="font-bold text-gray-900">
                    Demo Account
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    Email:
                    <span className="ml-1 font-semibold">
                      demo@foodrush.com
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Password:
                    <span className="ml-1 font-semibold">
                      FoodRush@123
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={fillDemoAccount}
                    className="mt-4 text-sm font-bold text-orange-500 transition hover:text-orange-600"
                  >
                    Use Demo Credentials
                  </button>

                </div>

              </div>

            </div>

            {/* SIGNUP */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}

              <Link
                to="/signup"
                className="font-bold text-orange-500 transition hover:text-orange-600"
              >
                Create Account
              </Link>
            </p>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Login;