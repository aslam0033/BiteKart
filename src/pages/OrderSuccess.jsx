import React from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Home,
  MapPin,
  PackageCheck,
  Phone,
  ReceiptText,
  ShoppingBag,
  Truck,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";

function OrderSuccess() {
  const navigate = useNavigate();

  let order = null;

  try {
    order = JSON.parse(
      localStorage.getItem("foodrush-last-order")
    );
  } catch {
    order = null;
  }

  /* ----------------------------------
     NO ORDER FOUND
  ---------------------------------- */

  if (!order) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6 py-16">
        <div className="w-full max-w-lg rounded-4xl bg-white p-8 text-center shadow-sm sm:p-12">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
            <ShoppingBag
              size={42}
              className="text-orange-500"
            />
          </div>

          <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
            No recent order found
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            You haven't placed an order yet.
            Explore restaurants and order something
            delicious.
          </p>

          <button
            onClick={() =>
              navigate("/restaurants")
            }
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            Browse Restaurants

            <ArrowRight size={18} />
          </button>

        </div>
      </section>
    );
  }

  /* ----------------------------------
     PAYMENT METHOD
  ---------------------------------- */

  const getPaymentMethod = () => {
    if (order.paymentMethod === "cod") {
      return "Cash on Delivery";
    }

    if (order.paymentMethod === "upi") {
      return "UPI";
    }

    if (order.paymentMethod === "card") {
      return "Debit / Credit Card";
    }

    return "Payment";
  };

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
      month: "long",
      year: "numeric",
    });

  const formattedTime =
    orderDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =================================
          SUCCESS HERO
      ================================= */}

      <section className="bg-linear-to-b from-green-50 to-gray-50 px-6 pb-10 pt-14">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
              <CheckCircle2
                size={38}
                className="text-white"
              />
            </div>

          </div>

          <p className="mt-6 font-semibold text-green-600">
            ORDER CONFIRMED
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-5xl">
            Your food is on the way!
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-500">
            Thanks for ordering with FoodRush.
            Your order has been successfully
            confirmed and will be prepared shortly.
          </p>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-5 py-2.5 text-sm font-semibold text-green-700 shadow-sm">
            <PackageCheck size={18} />

            Order #{order.id}
          </div>

        </div>

      </section>

      {/* =================================
          ORDER STATUS
      ================================= */}

      <section className="mx-auto max-w-5xl px-6">

        <div className="grid gap-4 rounded-3xl bg-zinc-900 p-6 text-white shadow-xl sm:grid-cols-3 sm:p-8">

          {/* CONFIRMED */}
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500">
              <CheckCircle2 size={23} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Order Status
              </p>

              <p className="mt-1 font-bold">
                {order.status || "Confirmed"}
              </p>
            </div>

          </div>

          {/* DELIVERY */}
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500">
              <Truck size={23} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Estimated Delivery
              </p>

              <p className="mt-1 font-bold">
                {order.estimatedDelivery ||
                  "25-35 minutes"}
              </p>
            </div>

          </div>

          {/* ORDER TIME */}
          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-700">
              <Clock size={23} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Ordered At
              </p>

              <p className="mt-1 text-sm font-bold">
                {formattedTime}
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <section className="mx-auto max-w-5xl px-6 py-10">

        <div className="grid gap-7 lg:grid-cols-[1fr_340px]">

          {/* =============================
              LEFT
          ============================== */}

          <div className="space-y-7">

            {/* ORDER ITEMS */}
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

              <div className="flex items-center justify-between border-b px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                    <UtensilsCrossed
                      size={19}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      Ordered Items
                    </h2>

                    <p className="text-xs text-gray-400">
                      {totalItems}{" "}
                      {totalItems === 1
                        ? "item"
                        : "items"}
                    </p>
                  </div>

                </div>

              </div>

              <div className="divide-y divide-gray-100">

                {order.items?.map((item) => (
                  <div
                    key={`${item.restaurantId}-${item.id}`}
                    className="flex gap-4 p-5 sm:p-6"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"
                    />

                    <div className="min-w-0 flex-1">

                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                        {item.category}
                      </p>

                      <h3 className="mt-1 font-bold text-gray-900 sm:text-lg">
                        {item.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-gray-400">
                        {item.restaurantName}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-4">

                        <p className="text-sm text-gray-500">
                          Qty:{" "}
                          <span className="font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                        </p>

                        <p className="font-bold text-gray-900">
                          ₹
                          {item.price *
                            item.quantity}
                        </p>

                      </div>

                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* CUSTOMER DETAILS */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-7">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <UserRound
                    size={19}
                    className="text-orange-500"
                  />
                </div>

                <h2 className="font-bold">
                  Customer Details
                </h2>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs text-gray-400">
                    Customer Name
                  </p>

                  <p className="mt-1 font-semibold">
                    {order.customer?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Phone Number
                  </p>

                  <div className="mt-1 flex items-center gap-2 font-semibold">

                    <Phone
                      size={15}
                      className="text-orange-500"
                    />

                    +91 {order.customer?.phone}

                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold">
                    {order.customer?.email}
                  </p>
                </div>

              </div>

            </div>

            {/* ADDRESS */}
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-7">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <MapPin
                    size={19}
                    className="text-orange-500"
                  />
                </div>

                <h2 className="font-bold">
                  Delivery Address
                </h2>

              </div>

              <p className="leading-7 text-gray-700">
                {order.customer?.address}
              </p>

              {order.customer?.landmark && (
                <p className="mt-2 text-sm text-gray-500">
                  Landmark:{" "}
                  {order.customer.landmark}
                </p>
              )}

              <p className="mt-2 text-sm font-medium text-gray-600">
                {order.customer?.city} -{" "}
                {order.customer?.pincode}
              </p>

              {order.customer?.instructions && (
                <div className="mt-5 rounded-2xl bg-orange-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                    Delivery Instructions
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {order.customer.instructions}
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* =============================
              RIGHT
          ============================== */}

          <aside className="h-fit space-y-5 lg:sticky lg:top-24">

            {/* PAYMENT */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                  <CreditCard
                    size={19}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Payment Method
                  </p>

                  <p className="font-bold">
                    {getPaymentMethod()}
                  </p>
                </div>

              </div>

              <div className="mt-5 flex items-center justify-between border-t pt-4">

                <span className="text-sm text-gray-500">
                  Payment Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    order.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>

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
                  Bill Details
                </h3>

              </div>

              <div className="mt-6 space-y-4 text-sm">

                <div className="flex justify-between text-gray-500">
                  <span>
                    Item Total
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{order.subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>
                    Delivery Fee
                  </span>

                  {order.deliveryFee === 0 ? (
                    <span className="font-semibold text-green-600">
                      FREE
                    </span>
                  ) : (
                    <span className="font-medium text-gray-900">
                      ₹{order.deliveryFee}
                    </span>
                  )}
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>
                    Platform Fee
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{order.platformFee}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between font-medium text-green-600">
                    <span>
                      Discount
                    </span>

                    <span>
                      - ₹{order.discount}
                    </span>
                  </div>
                )}

                <div className="border-t border-dashed pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-lg font-bold">
                      Total Paid
                    </span>

                    <span className="text-2xl font-extrabold text-orange-500">
                      ₹{order.total}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* ORDER INFO */}
            <div className="rounded-3xl border border-green-100 bg-green-50 p-5">

              <div className="flex gap-3">

                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <div>

                  <p className="font-bold text-green-800">
                    Order confirmed
                  </p>

                  <p className="mt-1 text-sm leading-6 text-green-700">
                    The restaurant has received your
                    order and will begin preparing it
                    shortly.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

        {/* =================================
            ORDER META
        ================================= */}

        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

          <div className="grid gap-6 sm:grid-cols-3">

            <div>
              <p className="text-xs text-gray-400">
                Order ID
              </p>

              <p className="mt-1 font-bold">
                #{order.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Order Date
              </p>

              <p className="mt-1 font-bold">
                {formattedDate}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Estimated Delivery
              </p>

              <p className="mt-1 font-bold text-green-600">
                {order.estimatedDelivery}
              </p>
            </div>

          </div>

        </div>

        {/* =================================
            ACTION BUTTONS
        ================================= */}

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

          <button
            onClick={() =>
              navigate("/orders")
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-orange-500 px-7 py-3.5 font-semibold text-orange-500 transition hover:bg-orange-50"
          >
            <PackageCheck size={19} />

            View My Orders
          </button>

          <button
            onClick={() =>
              navigate("/restaurants")
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            <UtensilsCrossed size={19} />

            Order More Food
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-7 py-3.5 font-semibold text-white transition hover:bg-zinc-800"
          >
            <Home size={19} />

            Home
          </button>

        </div>

      </section>

    </div>
  );
}

export default OrderSuccess;