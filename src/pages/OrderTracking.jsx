import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  Navigation,
  Package,
  PackageCheck,
  Phone,
  RefreshCcw,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react";

function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =====================================================
     FIND ORDER
  ===================================================== */

  const order = useMemo(() => {
    try {
      const orders =
        JSON.parse(
          localStorage.getItem("foodrush-orders")
        ) || [];

      return orders.find(
        (item) => item.id === id
      );
    } catch {
      return null;
    }
  }, [id]);

  /* =====================================================
     ORDER NOT FOUND
  ===================================================== */

  if (!order) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6 py-16">

        <div className="w-full max-w-lg rounded-4xl bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">

            <Package
              size={42}
              className="text-orange-500"
            />

          </div>

          <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
            Order not found
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            We couldn't find the order you're trying
            to track.
          </p>

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            View My Orders

            <ChevronRight size={18} />
          </button>

        </div>

      </section>
    );
  }

  /* =====================================================
     HELPERS
  ===================================================== */

  const restaurantNames = [
    ...new Set(
      order.items
        ?.map(
          (item) =>
            item.restaurantName
        )
        .filter(Boolean)
    ),
  ];

  const restaurantName =
    restaurantNames.join(", ") ||
    "FoodRush Restaurant";

  const totalItems =
    order.items?.reduce(
      (total, item) =>
        total + item.quantity,
      0
    ) || 0;

  const orderDate = order.orderedAt
    ? new Date(order.orderedAt)
    : new Date();

  const formattedDate =
    orderDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formattedTime =
    orderDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* =====================================================
     TRACKING STEPS
  ===================================================== */

  const steps = [
    {
      key: "Confirmed",
      title: "Order Confirmed",
      description:
        "Your order has been received by the restaurant.",
      icon: CheckCircle2,
    },
    {
      key: "Preparing",
      title: "Preparing Your Food",
      description:
        "The restaurant is preparing your delicious meal.",
      icon: PackageCheck,
    },
    {
      key: "Out for Delivery",
      title: "Out for Delivery",
      description:
        "Your delivery partner is bringing your food.",
      icon: Truck,
    },
    {
      key: "Delivered",
      title: "Delivered",
      description:
        "Your order has reached your delivery address.",
      icon: Home,
    },
  ];

  const statusIndex = {
    Confirmed: 0,
    Preparing: 1,
    "Out for Delivery": 2,
    Delivered: 3,
  };

  const currentStep =
    statusIndex[order.status] ?? 0;

  const isCancelled =
    order.status === "Cancelled";

  /* =====================================================
     REORDER
  ===================================================== */

  const reorder = () => {
    if (!order.items?.length) return;

    const cartItems =
      order.items.map((item) => ({
        ...item,
        quantity:
          item.quantity || 1,
      }));

    localStorage.setItem(
      "foodrush-cart",
      JSON.stringify(cartItems)
    );

    localStorage.removeItem(
      "foodrush-applied-promo"
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-9 lg:px-8">

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            <ArrowLeft size={18} />

            Back to Orders
          </button>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="font-semibold text-orange-500">
                Live Order Status
              </p>

              <h1 className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Track Your Order
              </h1>

              <p className="mt-2 text-gray-500">
                Order #{order.id}
              </p>

            </div>

            <div
              className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                isCancelled
                  ? "bg-red-100 text-red-600"
                  : order.status ===
                    "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {order.status}
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-7">

            {/* =============================================
                DELIVERY STATUS CARD
            ============================================= */}

            {!isCancelled ? (
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

                {/* TOP */}
                <div className="bg-zinc-950 p-6 text-white sm:p-8">

                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                      <p className="text-sm text-gray-400">
                        Estimated Delivery
                      </p>

                      <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">
                        {order.status ===
                        "Delivered"
                          ? "Order Delivered"
                          : order.estimatedDelivery ||
                            "25-35 minutes"}
                      </h2>

                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500">

                      {order.status ===
                      "Delivered" ? (
                        <CheckCircle2
                          size={30}
                        />
                      ) : (
                        <Truck size={30} />
                      )}

                    </div>

                  </div>

                  {order.status !==
                    "Delivered" && (
                    <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">

                      <Clock size={17} />

                      Your order is progressing normally.

                    </div>
                  )}

                </div>

                {/* TRACKER */}
                <div className="p-6 sm:p-8">

                  <div className="space-y-0">

                    {steps.map(
                      (step, index) => {
                        const Icon =
                          step.icon;

                        const completed =
                          index <
                          currentStep;

                        const active =
                          index ===
                          currentStep;

                        return (
                          <div
                            key={step.key}
                            className="relative flex gap-5"
                          >

                            {/* LINE */}
                            {index !==
                              steps.length -
                                1 && (
                              <div
                                className={`absolute left-5.75 top-12 h-[calc(100%-16px)] w-0.5 ${
                                  completed
                                    ? "bg-green-500"
                                    : "bg-gray-200"
                                }`}
                              />
                            )}

                            {/* ICON */}
                            <div
                              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 ${
                                completed
                                  ? "border-green-500 bg-green-500 text-white"
                                  : active
                                  ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                  : "border-gray-200 bg-white text-gray-400"
                              }`}
                            >
                              {completed ? (
                                <Check
                                  size={20}
                                />
                              ) : (
                                <Icon
                                  size={20}
                                />
                              )}
                            </div>

                            {/* TEXT */}
                            <div className="min-h-26.25 pb-6">

                              <div className="flex flex-wrap items-center gap-2">

                                <h3
                                  className={`font-bold ${
                                    active ||
                                    completed
                                      ? "text-gray-900"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {
                                    step.title
                                  }
                                </h3>

                                {active && (
                                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                                    Current
                                  </span>
                                )}

                              </div>

                              <p
                                className={`mt-2 text-sm leading-6 ${
                                  active ||
                                  completed
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                }`}
                              >
                                {
                                  step.description
                                }
                              </p>

                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

              </div>
            ) : (
              /* CANCELLED */
              <div className="rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

                  <XCircle
                    size={38}
                    className="text-red-500"
                  />

                </div>

                <h2 className="mt-6 text-2xl font-extrabold">
                  Order Cancelled
                </h2>

                <p className="mx-auto mt-3 max-w-lg leading-7 text-gray-500">
                  This order has been cancelled and
                  will no longer be prepared or delivered.
                </p>

                <button
                  onClick={reorder}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  <RefreshCcw
                    size={18}
                  />

                  Reorder Items
                </button>

              </div>
            )}

            {/* =============================================
                DELIVERY MAP UI
            ============================================= */}

            {!isCancelled &&
              order.status !== "Delivered" && (
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

                  <div className="flex items-center justify-between border-b px-6 py-5">

                    <div>

                      <h2 className="font-bold">
                        Delivery Route
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Track your delivery progress.
                      </p>

                    </div>

                    <Navigation
                      size={21}
                      className="text-orange-500"
                    />

                  </div>

                  {/* SIMULATED MAP */}
                  <div className="relative h-75 overflow-hidden bg-orange-50">

                    {/* MAP GRID */}
                    <div className="absolute inset-0 opacity-40">

                      <div className="absolute left-[12%] top-0 h-full w-3 rotate-18 bg-white" />
                      <div className="absolute left-[40%] top-0 h-full w-5 -rotate-10 bg-white" />
                      <div className="absolute right-[18%] top-0 h-full w-3 rotate-12 bg-white" />

                      <div className="absolute left-0 top-[30%] h-4 w-full rotate-4 bg-white" />
                      <div className="absolute left-0 top-[65%] h-5 w-full -rotate-5 bg-white" />

                    </div>

                    {/* RESTAURANT */}
                    <div className="absolute left-[12%] top-[25%]">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl">
                        <Store
                          size={21}
                        />
                      </div>

                      <div className="mt-2 rounded-lg bg-white px-3 py-1.5 text-xs font-bold shadow">
                        Restaurant
                      </div>

                    </div>

                    {/* PATH */}
                    <div className="absolute left-[23%] top-[38%] h-1 w-[52%] rotate-18 rounded-full border-t-4 border-dashed border-orange-400" />

                    {/* DELIVERY PERSON */}
                    <div className="absolute left-[52%] top-[48%]">

                      <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full border-4 border-white bg-orange-500 text-white shadow-xl">
                        <Truck
                          size={24}
                        />
                      </div>

                      <div className="mt-2 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow">
                        Your Order
                      </div>

                    </div>

                    {/* CUSTOMER */}
                    <div className="absolute bottom-[15%] right-[10%]">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-xl">
                        <Home
                          size={21}
                        />
                      </div>

                      <div className="mt-2 rounded-lg bg-white px-3 py-1.5 text-xs font-bold shadow">
                        Your Home
                      </div>

                    </div>

                  </div>

                  <div className="flex items-start gap-3 border-t p-5">

                    <MapPin
                      size={19}
                      className="mt-0.5 shrink-0 text-orange-500"
                    />

                    <div>

                      <p className="text-xs text-gray-400">
                        Delivery Address
                      </p>

                      <p className="mt-1 text-sm font-semibold leading-6 text-gray-700">
                        {order.customer
                          ?.address}
                        {order.customer
                          ?.city &&
                          `, ${order.customer.city}`}
                        {order.customer
                          ?.pincode &&
                          ` - ${order.customer.pincode}`}
                      </p>

                    </div>

                  </div>

                </div>
              )}

            {/* =============================================
                ORDER ITEMS
            ============================================= */}

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

              <div className="flex items-center justify-between border-b px-6 py-5">

                <div>

                  <h2 className="font-bold">
                    Order Items
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}
                  </p>

                </div>

                <span className="font-extrabold text-orange-500">
                  ₹{order.total}
                </span>

              </div>

              <div className="divide-y divide-gray-100">

                {order.items?.map(
                  (item) => (
                    <div
                      key={`${item.restaurantId}-${item.id}`}
                      className="flex gap-4 p-5 sm:p-6"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                      />

                      <div className="min-w-0 flex-1">

                        <p className="font-bold">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {
                            item.restaurantName
                          }
                        </p>

                        <div className="mt-3 flex justify-between gap-4 text-sm">

                          <span className="text-gray-500">
                            Qty{" "}
                            {item.quantity}
                          </span>

                          <span className="font-bold">
                            ₹
                            {item.price *
                              item.quantity}
                          </span>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="h-fit space-y-5 lg:sticky lg:top-24">

            {/* RESTAURANT */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                  <Store
                    size={20}
                    className="text-orange-500"
                  />
                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    Ordered From
                  </p>

                  <p className="font-bold">
                    {restaurantName}
                  </p>

                </div>

              </div>

            </div>

            {/* DELIVERY PARTNER */}
            {!isCancelled &&
              order.status !== "Confirmed" && (
                <div className="rounded-3xl bg-white p-6 shadow-sm">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Delivery Partner
                  </p>

                  <div className="mt-5 flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">

                      <UserRound
                        size={25}
                        className="text-orange-500"
                      />

                    </div>

                    <div>

                      <p className="font-bold">
                        Rahul K.
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        FoodRush Delivery
                      </p>

                    </div>

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <a
                      href="tel:+919876543210"
                      className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      <Phone size={17} />

                      Call
                    </a>

                    <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                      <Navigation
                        size={17}
                      />

                      Locate
                    </button>

                  </div>

                </div>
              )}

            {/* ORDER DETAILS */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h3 className="font-bold">
                Order Details
              </h3>

              <div className="mt-6 space-y-5">

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">
                    Order ID
                  </span>

                  <span className="text-sm font-bold">
                    #{order.id}
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">
                    Date
                  </span>

                  <span className="text-sm font-semibold">
                    {formattedDate}
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">
                    Time
                  </span>

                  <span className="text-sm font-semibold">
                    {formattedTime}
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-sm text-gray-500">
                    Items
                  </span>

                  <span className="text-sm font-semibold">
                    {totalItems}
                  </span>

                </div>

                <div className="border-t pt-4">

                  <div className="flex items-center justify-between">

                    <span className="font-bold">
                      Total
                    </span>

                    <span className="text-xl font-extrabold text-orange-500">
                      ₹{order.total}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* CUSTOMER */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h3 className="font-bold">
                Delivery Details
              </h3>

              <div className="mt-5 space-y-4">

                <div className="flex items-start gap-3">

                  <UserRound
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />

                  <div>

                    <p className="text-xs text-gray-400">
                      Customer
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {
                        order.customer
                          ?.name
                      }
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <Phone
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />

                  <div>

                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      +91{" "}
                      {
                        order.customer
                          ?.phone
                      }
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />

                  <div>

                    <p className="text-xs text-gray-400">
                      Address
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-6">
                      {
                        order.customer
                          ?.address
                      }
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ACTION */}
            {order.status ===
              "Delivered" && (
              <button
                onClick={reorder}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <RefreshCcw
                  size={19}
                />

                Reorder
              </button>
            )}

            <button
              onClick={() =>
                navigate("/orders")
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-4 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <ShoppingBag
                size={18}
              />

              View All Orders
            </button>

          </aside>

        </div>

      </section>

    </div>
  );
}

export default OrderTracking;