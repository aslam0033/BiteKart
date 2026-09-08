import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Tag,
  Truck,
  ReceiptText,
  ShieldCheck,
  UtensilsCrossed,
  X,
  CheckCircle2,
} from "lucide-react";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodrush-cart")) || [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [toast, setToast] = useState("");

  const saveCart = (newCart) => {
    setCart(newCart);

    localStorage.setItem(
      "foodrush-cart",
      JSON.stringify(newCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const increaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.id === item.id &&
      cartItem.restaurantId === item.restaurantId
        ? {
            ...cartItem,
            quantity: cartItem.quantity + 1,
          }
        : cartItem
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (item) => {
    if (item.quantity === 1) {
      removeItem(item);
      return;
    }

    const updatedCart = cart.map((cartItem) =>
      cartItem.id === item.id &&
      cartItem.restaurantId === item.restaurantId
        ? {
            ...cartItem,
            quantity: cartItem.quantity - 1,
          }
        : cartItem
    );

    saveCart(updatedCart);
  };

  const removeItem = (item) => {
    const updatedCart = cart.filter(
      (cartItem) =>
        !(
          cartItem.id === item.id &&
          cartItem.restaurantId === item.restaurantId
        )
    );

    saveCart(updatedCart);

    showToast(`${item.name} removed from cart`);
  };

  const clearCart = () => {
    saveCart([]);

    setAppliedPromo("");
    setPromoCode("");
    setPromoMessage("");

    showToast("Cart cleared");
  };

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cart]);

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40;

  const platformFee = subtotal === 0 ? 0 : 9;

  let discount = 0;

  if (appliedPromo === "FOOD40") {
    discount = Math.min(
      Math.round(subtotal * 0.4),
      120
    );
  }

  if (appliedPromo === "SAVE50") {
    discount = subtotal >= 399 ? 50 : 0;
  }

  const total =
    subtotal +
    deliveryFee +
    platformFee -
    discount;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (!code) {
      setPromoMessage("Enter a promo code.");
      return;
    }

    if (code === "FOOD40") {
      setAppliedPromo("FOOD40");
      setPromoMessage(
        "FOOD40 applied successfully."
      );

      showToast("Promo applied");
      return;
    }

    if (code === "SAVE50") {
      if (subtotal < 399) {
        setAppliedPromo("");
        setPromoMessage(
          "SAVE50 requires a minimum order of ₹399."
        );

        return;
      }

      setAppliedPromo("SAVE50");
      setPromoMessage(
        "SAVE50 applied successfully."
      );

      showToast("Promo applied");
      return;
    }

    setAppliedPromo("");
    setPromoMessage(
      "Invalid promo code. Try FOOD40 or SAVE50."
    );
  };

  const groupedCart = useMemo(() => {
    return cart.reduce((groups, item) => {
      const key =
        item.restaurantName || "Restaurant";

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);

      return groups;
    }, {});
  }, [cart]);

  if (cart.length === 0) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6 py-16">
        <div className="w-full max-w-xl rounded-4xl bg-white px-6 py-14 text-center shadow-sm sm:px-10">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
            <ShoppingBag
              size={42}
              className="text-orange-500"
            />
          </div>

          <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
            Looks like you haven't added any delicious food yet.
            Explore restaurants and add something you love.
          </p>

          <button
            onClick={() => navigate("/restaurants")}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Restaurants

            <ChevronRight size={18} />
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

      {/* PAGE HEADER */}
      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-500"
          >
            <ArrowLeft size={18} />

            Continue Shopping
          </button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="font-semibold text-orange-500">
                Your Order
              </p>

              <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
                Shopping Cart
              </h1>

              <p className="mt-2 text-gray-500">
                Review your items before proceeding to checkout.
              </p>
            </div>

            <button
              onClick={clearCart}
              className="flex w-fit items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={17} />

              Clear Cart
            </button>

          </div>

        </div>

      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}
          <div className="space-y-6">

            {Object.entries(groupedCart).map(
              ([restaurantName, items]) => (
                <div
                  key={restaurantName}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm"
                >

                  {/* RESTAURANT HEADER */}
                  <div className="flex items-center gap-3 border-b px-5 py-5 sm:px-6">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                      <UtensilsCrossed
                        size={21}
                        className="text-orange-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Ordering from
                      </p>

                      <h2 className="font-bold text-gray-900">
                        {restaurantName}
                      </h2>
                    </div>

                  </div>

                  {/* ITEMS */}
                  <div className="divide-y divide-gray-100">

                    {items.map((item) => (
                      <div
                        key={`${item.restaurantId}-${item.id}`}
                        className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6"
                      >

                        {/* IMAGE */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-36 w-full rounded-2xl object-cover sm:h-32 sm:w-36"
                        />

                        {/* DETAILS */}
                        <div className="flex flex-1 flex-col justify-between">

                          <div>

                            <div className="flex items-start justify-between gap-4">

                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                                  {item.category}
                                </p>

                                <h3 className="mt-1 text-lg font-bold text-gray-900">
                                  {item.name}
                                </h3>
                              </div>

                              <button
                                onClick={() =>
                                  removeItem(item)
                                }
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 size={18} />
                              </button>

                            </div>

                            {item.description && (
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                                {item.description}
                              </p>
                            )}

                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                            <p className="text-xl font-extrabold text-gray-900">
                              ₹{item.price * item.quantity}
                            </p>

                            <div className="flex items-center overflow-hidden rounded-xl border border-orange-200 bg-orange-50">

                              <button
                                onClick={() =>
                                  decreaseQuantity(item)
                                }
                                className="p-2.5 text-orange-600 transition hover:bg-orange-100"
                              >
                                <Minus size={17} />
                              </button>

                              <span className="min-w-10 text-center text-sm font-bold text-orange-600">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  increaseQuantity(item)
                                }
                                className="p-2.5 text-orange-600 transition hover:bg-orange-100"
                              >
                                <Plus size={17} />
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>
              )
            )}

            {/* ADD MORE FOOD */}
            <button
              onClick={() => navigate("/restaurants")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/40 py-5 font-semibold text-orange-500 transition hover:bg-orange-50"
            >
              <Plus size={19} />

              Add More Food
            </button>

          </div>

          {/* RIGHT SUMMARY */}
          <aside className="h-fit space-y-5 lg:sticky lg:top-24">

            {/* PROMO */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <Tag
                  size={20}
                  className="text-orange-500"
                />

                <h3 className="font-bold">
                  Apply Coupon
                </h3>

              </div>

              <div className="mt-5 flex gap-2">

                <input
                  value={promoCode}
                  onChange={(e) =>
                    setPromoCode(e.target.value)
                  }
                  placeholder="Enter promo code"
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm uppercase outline-none transition focus:border-orange-500"
                />

                <button
                  onClick={applyPromo}
                  className="rounded-xl bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
                >
                  Apply
                </button>

              </div>

              <p
                className={`mt-3 text-xs leading-5 ${
                  appliedPromo
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {promoMessage ||
                  "Try FOOD40 or SAVE50"}
              </p>

            </div>

            {/* BILL */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center gap-2">

                <ReceiptText
                  size={20}
                  className="text-orange-500"
                />

                <h3 className="text-lg font-bold">
                  Bill Details
                </h3>

              </div>

              <div className="mt-6 space-y-4 text-sm">

                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>

                  <span className="font-medium text-gray-900">
                    ₹{subtotal}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">

                  <div className="flex items-center gap-2">
                    <Truck size={16} />

                    Delivery Fee
                  </div>

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

                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee</span>

                  <span className="font-medium text-gray-900">
                    ₹{platformFee}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between font-medium text-green-600">
                    <span>
                      Coupon Discount
                    </span>

                    <span>
                      - ₹{discount}
                    </span>
                  </div>
                )}

                <div className="border-t border-dashed pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-lg font-bold text-gray-900">
                      To Pay
                    </span>

                    <span className="text-2xl font-extrabold text-orange-500">
                      ₹{total}
                    </span>

                  </div>

                </div>

              </div>

              {deliveryFee === 0 ? (
                <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">

                  <Truck size={17} />

                  You unlocked free delivery!

                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-700">
                  Add ₹{Math.max(499 - subtotal, 0)} more
                  to unlock free delivery.
                </div>
              )}

              <button
                onClick={() =>
                  navigate("/checkout")
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Proceed to Checkout

                <ChevronRight size={19} />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">

                <ShieldCheck size={15} />

                Secure checkout

              </div>

            </div>

          </aside>

        </div>

      </section>

    </div>
  );
}

export default Cart;