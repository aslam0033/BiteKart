import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  MapPin,
  Package,
  PackageCheck,
  ReceiptText,
  RefreshCcw,
  Search,
  ShoppingBag,
  Store,
  Truck,
  X,
  XCircle,
} from "lucide-react";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState(() => {
    try {
      const storedOrders =
        JSON.parse(
          localStorage.getItem("foodrush-orders")
        ) || [];

      return storedOrders.sort(
        (a, b) =>
          new Date(b.orderedAt) -
          new Date(a.orderedAt)
      );
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [expandedOrder, setExpandedOrder] =
    useState(null);
  const [toast, setToast] = useState("");

  const statusOptions = [
    "All",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  /* ----------------------------------
     TOAST
  ---------------------------------- */

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2300);
  };

  /* ----------------------------------
     SAVE ORDERS
  ---------------------------------- */

  const saveOrders = (updatedOrders) => {
    setOrders(updatedOrders);

    localStorage.setItem(
      "foodrush-orders",
      JSON.stringify(updatedOrders)
    );
  };

  /* ----------------------------------
     FILTER ORDERS
  ---------------------------------- */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search
        .trim()
        .toLowerCase();

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      if (!query) {
        return matchesStatus;
      }

      const matchesOrderId =
        order.id
          ?.toLowerCase()
          .includes(query);

      const matchesItems =
        order.items?.some((item) =>
          item.name
            ?.toLowerCase()
            .includes(query)
        );

      const matchesRestaurant =
        order.items?.some((item) =>
          item.restaurantName
            ?.toLowerCase()
            .includes(query)
        );

      return (
        matchesStatus &&
        (matchesOrderId ||
          matchesItems ||
          matchesRestaurant)
      );
    });
  }, [orders, search, statusFilter]);

  /* ----------------------------------
     HELPERS
  ---------------------------------- */

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getItemCount = (order) => {
    return (
      order.items?.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ) || 0
    );
  };

  const getRestaurantNames = (order) => {
    const names = [
      ...new Set(
        order.items
          ?.map(
            (item) =>
              item.restaurantName
          )
          .filter(Boolean)
      ),
    ];

    return names.join(", ");
  };

  const getPaymentMethod = (method) => {
    if (method === "cod") {
      return "Cash on Delivery";
    }

    if (method === "upi") {
      return "UPI";
    }

    if (method === "card") {
      return "Card";
    }

    return "Payment";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-100";

      case "Preparing":
        return "bg-orange-50 text-orange-700 border-orange-100";

      case "Out for Delivery":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "Delivered":
        return "bg-green-50 text-green-700 border-green-100";

      case "Cancelled":
        return "bg-red-50 text-red-600 border-red-100";

      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={15} />;

      case "Out for Delivery":
        return <Truck size={15} />;

      case "Cancelled":
        return <XCircle size={15} />;

      default:
        return <Package size={15} />;
    }
  };

  /* ----------------------------------
     REORDER
  ---------------------------------- */

  const reorder = (order) => {
    if (!order.items?.length) return;

    const restoredCart = order.items.map(
      (item) => ({
        ...item,
        quantity: item.quantity || 1,
      })
    );

    localStorage.setItem(
      "foodrush-cart",
      JSON.stringify(restoredCart)
    );

    localStorage.removeItem(
      "foodrush-applied-promo"
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    showToast(
      "Items added back to your cart"
    );

    setTimeout(() => {
      navigate("/cart");
    }, 450);
  };

  /* ----------------------------------
     CANCEL ORDER
  ---------------------------------- */

  const cancelOrder = (orderId) => {
    const updatedOrders = orders.map(
      (order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Cancelled",
            }
          : order
    );

    saveOrders(updatedOrders);

    const lastOrder = JSON.parse(
      localStorage.getItem(
        "foodrush-last-order"
      ) || "null"
    );

    if (
      lastOrder &&
      lastOrder.id === orderId
    ) {
      localStorage.setItem(
        "foodrush-last-order",
        JSON.stringify({
          ...lastOrder,
          status: "Cancelled",
        })
      );
    }

    showToast("Order cancelled");
  };

  /* ----------------------------------
     EMPTY ORDER HISTORY
  ---------------------------------- */

  if (orders.length === 0) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6 py-16">

        <div className="w-full max-w-xl rounded-4xl bg-white px-6 py-14 text-center shadow-sm sm:px-10">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">

            <PackageCheck
              size={42}
              className="text-orange-500"
            />

          </div>

          <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
            No orders yet
          </h1>

          <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
            Once you place an order, you'll be able
            to view its details and status here.
          </p>

          <button
            onClick={() =>
              navigate("/restaurants")
            }
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            Order Food

            <ArrowRight size={18} />
          </button>

        </div>

      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* TOAST */}
      {toast && (
        <div className="fixed right-5 top-24 z-100 flex items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-4 text-sm font-medium text-white shadow-2xl">

          <CheckCircle2
            size={20}
            className="text-green-400"
          />

          {toast}

          <button onClick={() => setToast("")}>
            <X
              size={17}
              className="text-gray-400"
            />
          </button>

        </div>
      )}

      {/* ====================================
          HEADER
      ==================================== */}

      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

            <div>

              <p className="font-semibold text-orange-500">
                Order History
              </p>

              <h1 className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-3 max-w-xl leading-7 text-gray-500">
                View your previous orders, check
                delivery status and reorder your
                favorite meals.
              </p>

            </div>

            <div className="rounded-2xl bg-orange-50 px-5 py-4">

              <p className="text-xs font-medium text-gray-500">
                Total Orders
              </p>

              <p className="mt-1 text-2xl font-extrabold text-orange-500">
                {orders.length}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================
          SEARCH / FILTER
      ==================================== */}

      <section className="border-y bg-white">

        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

          <div className="flex flex-col gap-4 lg:flex-row">

            {/* SEARCH */}
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 focus-within:border-orange-500">

              <Search
                size={20}
                className="shrink-0 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search order ID, food or restaurant..."
                className="w-full bg-transparent text-sm outline-none"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                >
                  <X
                    size={17}
                    className="text-gray-400"
                  />
                </button>
              )}

            </div>

            {/* FILTER */}
            <div className="flex gap-2 overflow-x-auto pb-1">

              {statusOptions.map(
                (status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setStatusFilter(status)
                    }
                    className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      statusFilter === status
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}

            </div>

          </div>

        </div>

      </section>

      {/* ====================================
          ORDERS
      ==================================== */}

      <section className="mx-auto max-w-5xl px-6 py-10">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold">
              {statusFilter === "All"
                ? "All Orders"
                : `${statusFilter} Orders`}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1
                ? "order"
                : "orders"}{" "}
              found
            </p>
          </div>

        </div>

        {/* NO FILTER RESULTS */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">

              <Search
                size={27}
                className="text-orange-500"
              />

            </div>

            <h3 className="mt-5 text-xl font-bold">
              No matching orders
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or order
              status filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white"
            >
              Clear Filters
            </button>

          </div>
        ) : (
          <div className="space-y-6">

            {filteredOrders.map((order) => {
              const expanded =
                expandedOrder === order.id;

              const itemCount =
                getItemCount(order);

              const restaurantNames =
                getRestaurantNames(order);

              const canCancel = [
                "Confirmed",
                "Preparing",
              ].includes(order.status);

              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* =========================
                      ORDER HEADER
                  ========================= */}

                  <div className="border-b border-gray-100 p-5 sm:p-6">

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-lg font-extrabold text-gray-900">
                            Order #{order.id}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(
                              order.status
                            )}

                            {order.status}
                          </span>

                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">

                          <div className="flex items-center gap-2">

                            <CalendarDays
                              size={16}
                              className="text-orange-500"
                            />

                            {formatDate(
                              order.orderedAt
                            )}

                          </div>

                          <div className="flex items-center gap-2">

                            <Clock
                              size={16}
                              className="text-orange-500"
                            />

                            {formatTime(
                              order.orderedAt
                            )}

                          </div>

                        </div>

                      </div>

                      <div className="md:text-right">

                        <p className="text-xs text-gray-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-2xl font-extrabold text-orange-500">
                          ₹{order.total}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* =========================
                      SUMMARY
                  ========================= */}

                  <div className="p-5 sm:p-6">

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                      {/* RESTAURANT */}
                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Restaurant
                        </p>

                        <div className="mt-2 flex items-start gap-2">

                          <Store
                            size={17}
                            className="mt-0.5 shrink-0 text-orange-500"
                          />

                          <p className="text-sm font-semibold leading-6 text-gray-800">
                            {restaurantNames ||
                              "FoodRush Restaurant"}
                          </p>

                        </div>

                      </div>

                      {/* ITEMS */}
                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Items
                        </p>

                        <div className="mt-2 flex items-center gap-2">

                          <ShoppingBag
                            size={17}
                            className="text-orange-500"
                          />

                          <p className="text-sm font-semibold">
                            {itemCount}{" "}
                            {itemCount === 1
                              ? "item"
                              : "items"}
                          </p>

                        </div>

                      </div>

                      {/* PAYMENT */}
                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Payment
                        </p>

                        <div className="mt-2 flex items-center gap-2">

                          <CreditCard
                            size={17}
                            className="text-orange-500"
                          />

                          <div>
                            <p className="text-sm font-semibold">
                              {getPaymentMethod(
                                order.paymentMethod
                              )}
                            </p>

                            <p
                              className={`mt-0.5 text-xs font-medium ${
                                order.paymentStatus ===
                                "Paid"
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {
                                order.paymentStatus
                              }
                            </p>
                          </div>

                        </div>

                      </div>

                      {/* DELIVERY */}
                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Delivery
                        </p>

                        <div className="mt-2 flex items-center gap-2">

                          <Truck
                            size={17}
                            className="text-orange-500"
                          />

                          <p className="text-sm font-semibold">
                            {order.status ===
                            "Delivered"
                              ? "Delivered"
                              : order.status ===
                                "Cancelled"
                              ? "Cancelled"
                              : order.estimatedDelivery ||
                                "25-35 min"}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* PREVIEW ITEMS */}
                    <div className="mt-6 flex gap-3 overflow-x-auto pb-2">

                      {order.items
                        ?.slice(0, 4)
                        .map((item) => (
                          <div
                            key={`${order.id}-${item.id}`}
                            className="flex min-w-52.5 items-center gap-3 rounded-2xl bg-gray-50 p-3"
                          >

                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-14 w-14 shrink-0 rounded-xl object-cover"
                            />

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold">
                                {item.name}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                Qty{" "}
                                {item.quantity} • ₹
                                {item.price *
                                  item.quantity}
                              </p>

                            </div>

                          </div>
                        ))}

                      {order.items?.length > 4 && (
                        <div className="flex  min-w-25 items-center justify-center rounded-2xl bg-orange-50 px-4 text-sm font-bold text-orange-500">
                          +
                          {order.items.length -
                            4}{" "}
                          more
                        </div>
                      )}

                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:flex-wrap">

                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expanded
                              ? null
                              : order.id
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                      >
                        <ReceiptText
                          size={17}
                        />

                        {expanded
                          ? "Hide Details"
                          : "Order Details"}

                        {expanded ? (
                          <ChevronUp
                            size={16}
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                          />
                        )}
                      </button>

                      {![
                        "Delivered",
                        "Cancelled",
                      ].includes(
                        order.status
                      ) && (
                        <button
                          onClick={() =>
                            navigate(
                              `/track-order/${order.id}`
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-100"
                        >
                          <Truck size={17} />

                          Track Order
                        </button>
                      )}

                      <button
                        onClick={() =>
                          reorder(order)
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        <RefreshCcw
                          size={17}
                        />

                        Reorder
                      </button>

                      {canCancel && (
                        <button
                          onClick={() =>
                            cancelOrder(
                              order.id
                            )
                          }
                          className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50 sm:ml-auto"
                        >
                          <XCircle
                            size={17}
                          />

                          Cancel Order
                        </button>
                      )}

                    </div>

                  </div>

                  {/* =========================
                      EXPANDED DETAILS
                  ========================= */}

                  {expanded && (
                    <div className="border-t bg-gray-50 p-5 sm:p-7">

                      <div className="grid gap-7 lg:grid-cols-[1fr_300px]">

                        {/* ITEMS */}
                        <div>

                          <h3 className="font-bold text-gray-900">
                            Order Items
                          </h3>

                          <div className="mt-4 space-y-3">

                            {order.items?.map(
                              (item) => (
                                <div
                                  key={`${order.id}-details-${item.id}`}
                                  className="flex items-center gap-4 rounded-2xl bg-white p-4"
                                >

                                  <img
                                    src={
                                      item.image
                                    }
                                    alt={
                                      item.name
                                    }
                                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                                  />

                                  <div className="min-w-0 flex-1">

                                    <p className="font-bold">
                                      {
                                        item.name
                                      }
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                      {
                                        item.restaurantName
                                      }
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">
                                      ₹
                                      {
                                        item.price
                                      }{" "}
                                      ×{" "}
                                      {
                                        item.quantity
                                      }
                                    </p>

                                  </div>

                                  <p className="font-bold">
                                    ₹
                                    {item.price *
                                      item.quantity}
                                  </p>

                                </div>
                              )
                            )}

                          </div>

                          {/* DELIVERY ADDRESS */}
                          <div className="mt-6 rounded-2xl bg-white p-5">

                            <div className="flex items-center gap-2">

                              <MapPin
                                size={18}
                                className="text-orange-500"
                              />

                              <h3 className="font-bold">
                                Delivery
                                Address
                              </h3>

                            </div>

                            <p className="mt-4 text-sm leading-6 text-gray-600">
                              {
                                order
                                  .customer
                                  ?.address
                              }
                            </p>

                            {order.customer
                              ?.landmark && (
                              <p className="mt-2 text-sm text-gray-500">
                                Landmark:{" "}
                                {
                                  order
                                    .customer
                                    .landmark
                                }
                              </p>
                            )}

                            <p className="mt-2 text-sm font-semibold text-gray-700">
                              {
                                order
                                  .customer
                                  ?.city
                              }{" "}
                              -{" "}
                              {
                                order
                                  .customer
                                  ?.pincode
                              }
                            </p>

                          </div>

                        </div>

                        {/* BILL DETAILS */}
                        <div className="h-fit rounded-2xl bg-white p-5">

                          <div className="flex items-center gap-2">

                            <ReceiptText
                              size={18}
                              className="text-orange-500"
                            />

                            <h3 className="font-bold">
                              Bill Details
                            </h3>

                          </div>

                          <div className="mt-5 space-y-4 text-sm">

                            <div className="flex justify-between text-gray-500">
                              <span>
                                Item Total
                              </span>

                              <span className="font-medium text-gray-900">
                                ₹
                                {
                                  order.subtotal
                                }
                              </span>
                            </div>

                            <div className="flex justify-between text-gray-500">
                              <span>
                                Delivery Fee
                              </span>

                              {order.deliveryFee ===
                              0 ? (
                                <span className="font-semibold text-green-600">
                                  FREE
                                </span>
                              ) : (
                                <span className="font-medium text-gray-900">
                                  ₹
                                  {
                                    order.deliveryFee
                                  }
                                </span>
                              )}
                            </div>

                            <div className="flex justify-between text-gray-500">
                              <span>
                                Platform Fee
                              </span>

                              <span className="font-medium text-gray-900">
                                ₹
                                {
                                  order.platformFee
                                }
                              </span>
                            </div>

                            {order.discount >
                              0 && (
                              <div className="flex justify-between font-medium text-green-600">
                                <span>
                                  Discount
                                </span>

                                <span>
                                  - ₹
                                  {
                                    order.discount
                                  }
                                </span>
                              </div>
                            )}

                            <div className="border-t border-dashed pt-4">

                              <div className="flex items-center justify-between">

                                <span className="font-bold">
                                  Total
                                </span>

                                <span className="text-xl font-extrabold text-orange-500">
                                  ₹
                                  {
                                    order.total
                                  }
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </article>
              );
            })}

          </div>
        )}

      </section>

    </div>
  );
}

export default Orders;