import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  IndianRupee,
  MapPin,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  Truck,
  UserRound,
  WalletCards,
} from "lucide-react";

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodrush-cart")) || [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    city: "Jamkhandi",
    pincode: "",
    instructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [upiId, setUpiId] = useState("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  });

  const [errors, setErrors] = useState({});

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  const deliveryFee = subtotal >= 499 ? 0 : 40;

  const platformFee = cart.length > 0 ? 9 : 0;

  const savedPromo =
    localStorage.getItem("foodrush-applied-promo") || "";

  let discount = 0;

  if (savedPromo === "FOOD40") {
    discount = Math.min(
      Math.round(subtotal * 0.4),
      120
    );
  }

  if (savedPromo === "SAVE50" && subtotal >= 399) {
    discount = 50;
  }

  const total =
    subtotal +
    deliveryFee +
    platformFee -
    discount;

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "cardNumber") {
      const numbers = value
        .replace(/\D/g, "")
        .slice(0, 16);

      updatedValue = numbers.replace(
        /(\d{4})(?=\d)/g,
        "$1 "
      );
    }

    if (name === "cvv") {
      updatedValue = value
        .replace(/\D/g, "")
        .slice(0, 3);
    }

    if (name === "expiry") {
      let numbers = value
        .replace(/\D/g, "")
        .slice(0, 4);

      if (numbers.length >= 3) {
        numbers =
          numbers.slice(0, 2) +
          "/" +
          numbers.slice(2);
      }

      updatedValue = numbers;
    }

    setCardDetails((current) => ({
      ...current,
      [name]: updatedValue,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Name must contain at least 3 characters.";
    }

    if (!formData.phone) {
      newErrors.phone =
        "Please enter your phone number.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Please enter your delivery address.";
    } else if (formData.address.trim().length < 10) {
      newErrors.address =
        "Please enter a complete delivery address.";
    }

    if (!formData.city.trim()) {
      newErrors.city =
        "Please enter your city.";
    }

    if (!formData.pincode) {
      newErrors.pincode =
        "Please enter your pincode.";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode =
        "Pincode must contain 6 digits.";
    }

    if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        newErrors.upiId =
          "Please enter your UPI ID.";
      } else if (
        !/^[\w.-]+@[\w.-]+$/.test(upiId.trim())
      ) {
        newErrors.upiId =
          "Enter a valid UPI ID.";
      }
    }

    if (paymentMethod === "card") {
      const cleanCardNumber =
        cardDetails.cardNumber.replace(/\s/g, "");

      if (!cardDetails.cardName.trim()) {
        newErrors.cardName =
          "Enter the cardholder name.";
      }

      if (
        !/^\d{16}$/.test(cleanCardNumber)
      ) {
        newErrors.cardNumber =
          "Enter a valid 16-digit card number.";
      }

      if (
        !/^\d{2}\/\d{2}$/.test(
          cardDetails.expiry
        )
      ) {
        newErrors.expiry =
          "Enter expiry as MM/YY.";
      }

      if (!/^\d{3}$/.test(cardDetails.cvv)) {
        newErrors.cvv =
          "Enter a valid 3-digit CVV.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const orderId = `FR${Date.now()
      .toString()
      .slice(-8)}`;

    const order = {
      id: orderId,

      items: cart,

      customer: {
        ...formData,
      },

      paymentMethod,

      paymentStatus:
        paymentMethod === "cod"
          ? "Pending"
          : "Paid",

      subtotal,
      deliveryFee,
      platformFee,
      discount,
      total,

      status: "Confirmed",

      orderedAt: new Date().toISOString(),

      estimatedDelivery: "25-35 minutes",
    };

    const previousOrders = JSON.parse(
      localStorage.getItem("foodrush-orders") ||
        "[]"
    );

    localStorage.setItem(
      "foodrush-orders",
      JSON.stringify([
        order,
        ...previousOrders,
      ])
    );

    localStorage.setItem(
      "foodrush-last-order",
      JSON.stringify(order)
    );

    localStorage.removeItem("foodrush-cart");
    localStorage.removeItem(
      "foodrush-applied-promo"
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    navigate("/order-success");
  };

  if (cart.length === 0) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6">

        <div className="max-w-lg text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
            <PackageCheck
              size={42}
              className="text-orange-500"
            />
          </div>

          <h1 className="mt-7 text-3xl font-extrabold">
            Nothing to checkout
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            Your cart is currently empty. Add some
            food before proceeding to checkout.
          </p>

          <button
            onClick={() =>
              navigate("/restaurants")
            }
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Browse Restaurants

            <ChevronRight size={18} />
          </button>

        </div>

      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-9 lg:px-8">

          <button
            onClick={() => navigate("/cart")}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            <ArrowLeft size={18} />

            Back to Cart
          </button>

          <div>

            <p className="font-semibold text-orange-500">
              Almost there
            </p>

            <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
              Checkout
            </h1>

            <p className="mt-2 text-gray-500">
              Add your delivery details and review
              your order.
            </p>

          </div>

        </div>

      </section>

      <form onSubmit={placeOrder}>

        <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-[1fr_390px]">

            {/* LEFT SIDE */}
            <div className="space-y-7">

              {/* CUSTOMER DETAILS */}
              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                    <UserRound
                      size={21}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Customer Details
                    </h2>

                    <p className="text-sm text-gray-500">
                      Who should we deliver to?
                    </p>
                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* NAME */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold">
                      Full Name
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                        errors.name
                          ? "border-red-400"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />

                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.name}
                      </p>
                    )}

                  </div>

                  {/* PHONE */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold">
                      Phone Number
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div
                      className={`flex overflow-hidden rounded-xl border ${
                        errors.phone
                          ? "border-red-400"
                          : "border-gray-200 focus-within:border-orange-500"
                      }`}
                    >

                      <span className="flex items-center border-r bg-gray-50 px-3 text-sm text-gray-500">
                        +91
                      </span>

                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="w-full px-4 py-3 outline-none"
                      />

                    </div>

                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}

                  </div>

                  {/* EMAIL */}
                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-semibold">
                      Email Address
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                        errors.email
                          ? "border-red-400"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.email}
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
                      size={21}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Delivery Address
                    </h2>

                    <p className="text-sm text-gray-500">
                      Where should we deliver your food?
                    </p>
                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* ADDRESS */}
                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-semibold">
                      Complete Address
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="4"
                      placeholder="House number, street, area..."
                      className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition ${
                        errors.address
                          ? "border-red-400"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />

                    {errors.address && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.address}
                      </p>
                    )}

                  </div>

                  {/* LANDMARK */}
                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-semibold">
                      Landmark
                      <span className="ml-1 font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>

                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Near college, hospital, etc."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500"
                    />

                  </div>

                  {/* CITY */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold">
                      City
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                        errors.city
                          ? "border-red-400"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />

                    {errors.city && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.city}
                      </p>
                    )}

                  </div>

                  {/* PINCODE */}
                  <div>

                    <label className="mb-2 block text-sm font-semibold">
                      Pincode
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="587301"
                      className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                        errors.pincode
                          ? "border-red-400"
                          : "border-gray-200 focus:border-orange-500"
                      }`}
                    />

                    {errors.pincode && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.pincode}
                      </p>
                    )}

                  </div>

                  {/* INSTRUCTIONS */}
                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-sm font-semibold">
                      Delivery Instructions
                      <span className="ml-1 font-normal text-gray-400">
                        (Optional)
                      </span>
                    </label>

                    <textarea
                      name="instructions"
                      value={
                        formData.instructions
                      }
                      onChange={handleChange}
                      rows="3"
                      placeholder="Example: Call me when you reach the gate."
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-orange-500"
                    />

                  </div>

                </div>

              </div>

              {/* PAYMENT */}
              <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

                <div className="mb-7 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                    <WalletCards
                      size={21}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Payment Method
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select how you'd like to pay.
                    </p>
                  </div>

                </div>

                <div className="space-y-4">

                  {/* COD */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition ${
                      paymentMethod === "cod"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >

                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={
                        paymentMethod === "cod"
                      }
                      onChange={(e) =>
                        setPaymentMethod(
                          e.target.value
                        )
                      }
                      className="accent-orange-500"
                    />

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                      <IndianRupee
                        size={21}
                        className="text-orange-500"
                      />
                    </div>

                    <div>
                      <p className="font-bold">
                        Cash on Delivery
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Pay when your food arrives.
                      </p>
                    </div>

                  </label>

                  {/* UPI */}
                  <label
                    className={`block cursor-pointer rounded-2xl border p-5 transition ${
                      paymentMethod === "upi"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={
                          paymentMethod === "upi"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                        className="accent-orange-500"
                      />

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Smartphone
                          size={21}
                          className="text-orange-500"
                        />
                      </div>

                      <div>
                        <p className="font-bold">
                          UPI
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Pay using any UPI application.
                        </p>
                      </div>

                    </div>

                    {paymentMethod === "upi" && (
                      <div className="ml-0 mt-5 sm:ml-18.75">

                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(
                              e.target.value
                            );

                            setErrors((current) => ({
                              ...current,
                              upiId: "",
                            }));
                          }}
                          placeholder="example@upi"
                          className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition ${
                            errors.upiId
                              ? "border-red-400"
                              : "border-gray-200 focus:border-orange-500"
                          }`}
                        />

                        {errors.upiId && (
                          <p className="mt-1.5 text-xs text-red-500">
                            {errors.upiId}
                          </p>
                        )}

                      </div>
                    )}

                  </label>

                  {/* CARD */}
                  <label
                    className={`block cursor-pointer rounded-2xl border p-5 transition ${
                      paymentMethod === "card"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={
                          paymentMethod === "card"
                        }
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value
                          )
                        }
                        className="accent-orange-500"
                      />

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                        <CreditCard
                          size={21}
                          className="text-orange-500"
                        />
                      </div>

                      <div>
                        <p className="font-bold">
                          Debit / Credit Card
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Secure card payment.
                        </p>
                      </div>

                    </div>

                    {paymentMethod === "card" && (
                      <div className="mt-6 grid gap-4 sm:ml-18.75 sm:grid-cols-2">

                        <div className="sm:col-span-2">

                          <input
                            type="text"
                            name="cardName"
                            value={
                              cardDetails.cardName
                            }
                            onChange={
                              handleCardChange
                            }
                            placeholder="Name on card"
                            className={`w-full rounded-xl border bg-white px-4 py-3 outline-none ${
                              errors.cardName
                                ? "border-red-400"
                                : "border-gray-200 focus:border-orange-500"
                            }`}
                          />

                          {errors.cardName && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.cardName}
                            </p>
                          )}

                        </div>

                        <div className="sm:col-span-2">

                          <input
                            type="text"
                            name="cardNumber"
                            value={
                              cardDetails.cardNumber
                            }
                            onChange={
                              handleCardChange
                            }
                            placeholder="1234 5678 9012 3456"
                            className={`w-full rounded-xl border bg-white px-4 py-3 outline-none ${
                              errors.cardNumber
                                ? "border-red-400"
                                : "border-gray-200 focus:border-orange-500"
                            }`}
                          />

                          {errors.cardNumber && (
                            <p className="mt-1 text-xs text-red-500">
                              {
                                errors.cardNumber
                              }
                            </p>
                          )}

                        </div>

                        <div>

                          <input
                            type="text"
                            name="expiry"
                            value={
                              cardDetails.expiry
                            }
                            onChange={
                              handleCardChange
                            }
                            placeholder="MM/YY"
                            className={`w-full rounded-xl border bg-white px-4 py-3 outline-none ${
                              errors.expiry
                                ? "border-red-400"
                                : "border-gray-200 focus:border-orange-500"
                            }`}
                          />

                          {errors.expiry && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.expiry}
                            </p>
                          )}

                        </div>

                        <div>

                          <input
                            type="password"
                            name="cvv"
                            value={cardDetails.cvv}
                            onChange={
                              handleCardChange
                            }
                            placeholder="CVV"
                            className={`w-full rounded-xl border bg-white px-4 py-3 outline-none ${
                              errors.cvv
                                ? "border-red-400"
                                : "border-gray-200 focus:border-orange-500"
                            }`}
                          />

                          {errors.cvv && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.cvv}
                            </p>
                          )}

                        </div>

                      </div>
                    )}

                  </label>

                </div>

              </div>

            </div>

            {/* ORDER SUMMARY */}
            <aside className="h-fit space-y-5 lg:sticky lg:top-24">

              {/* DELIVERY */}
              <div className="rounded-3xl bg-zinc-900 p-6 text-white">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                    <Truck size={21} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">
                      Estimated Delivery
                    </p>

                    <p className="font-bold">
                      25-35 minutes
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">

                  <Clock size={15} />

                  Delivery starts after order confirmation.

                </div>

              </div>

              {/* ITEMS */}
              <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <h3 className="font-bold">
                    Your Order
                  </h3>

                  <span className="text-sm text-gray-500">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}
                  </span>

                </div>

                <div className="mt-5 max-h-75 space-y-5 overflow-y-auto pr-1">

                  {cart.map((item) => (
                    <div
                      key={`${item.restaurantId}-${item.id}`}
                      className="flex gap-3"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 shrink-0 rounded-xl object-cover"
                      />

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-bold">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <p className="text-sm font-bold">
                        ₹
                        {item.price *
                          item.quantity}
                      </p>

                    </div>
                  ))}

                </div>

              </div>

              {/* BILL */}
              <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">

                  <ReceiptText
                    size={19}
                    className="text-orange-500"
                  />

                  <h3 className="font-bold">
                    Payment Summary
                  </h3>

                </div>

                <div className="mt-6 space-y-4 text-sm">

                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>

                    <span className="font-medium text-gray-900">
                      ₹{subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>
                      Delivery Fee
                    </span>

                    {deliveryFee === 0 ? (
                      <span className="font-semibold text-green-600">
                        FREE
                      </span>
                    ) : (
                      <span className="font-medium text-gray-900">
                        ₹{deliveryFee}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>
                      Platform Fee
                    </span>

                    <span className="font-medium text-gray-900">
                      ₹{platformFee}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between font-medium text-green-600">
                      <span>
                        Discount
                      </span>

                      <span>
                        - ₹{discount}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-dashed pt-4">

                    <div className="flex items-center justify-between">

                      <span className="text-lg font-bold">
                        Total
                      </span>

                      <span className="text-2xl font-extrabold text-orange-500">
                        ₹{total}
                      </span>

                    </div>

                  </div>

                </div>

                <button
                  type="submit"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Place Order

                  <ChevronRight size={19} />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-400">

                  <ShieldCheck size={15} />

                  Your payment information is secure

                </div>

              </div>

              {/* CONFIRMATION INFO */}
              <div className="flex gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">

                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <p className="text-sm leading-6 text-green-700">
                  After placing the order, you'll
                  receive an order ID and complete
                  order summary.
                </p>

              </div>

            </aside>

          </div>

        </section>

      </form>

    </div>
  );
}

export default Checkout;