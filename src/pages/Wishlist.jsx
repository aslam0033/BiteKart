import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Store,
  Trash2,
  X,
} from "lucide-react";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("foodrush-wishlist")
        ) || []
      );
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("foodrush-cart")
        ) || []
      );
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const saveWishlist = (updatedWishlist) => {
    setWishlist(updatedWishlist);

    localStorage.setItem(
      "foodrush-wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "foodrush-cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const removeFromWishlist = (food) => {
    const updatedWishlist =
      wishlist.filter(
        (item) =>
          !(
            item.id === food.id &&
            item.restaurantId ===
              food.restaurantId
          )
      );

    saveWishlist(updatedWishlist);

    showToast(
      `${food.name} removed from wishlist`
    );
  };

  const clearWishlist = () => {
    saveWishlist([]);

    showToast("Wishlist cleared");
  };

  const addToCart = (food) => {
    const existing = cart.find(
      (item) =>
        item.id === food.id &&
        item.restaurantId ===
          food.restaurantId
    );

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item.id === food.id &&
        item.restaurantId ===
          food.restaurantId
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...food,
          quantity: 1,
        },
      ];
    }

    saveCart(updatedCart);

    showToast(
      `${food.name} added to cart`
    );
  };

  const increaseQuantity = (food) => {
    addToCart(food);
  };

  const decreaseQuantity = (food) => {
    const existing = cart.find(
      (item) =>
        item.id === food.id &&
        item.restaurantId ===
          food.restaurantId
    );

    if (!existing) return;

    let updatedCart;

    if (existing.quantity === 1) {
      updatedCart = cart.filter(
        (item) =>
          !(
            item.id === food.id &&
            item.restaurantId ===
              food.restaurantId
          )
      );
    } else {
      updatedCart = cart.map((item) =>
        item.id === food.id &&
        item.restaurantId ===
          food.restaurantId
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      );
    }

    saveCart(updatedCart);
  };

  const getQuantity = (food) => {
    return (
      cart.find(
        (item) =>
          item.id === food.id &&
          item.restaurantId ===
            food.restaurantId
      )?.quantity || 0
    );
  };

  const moveAllToCart = () => {
    let updatedCart = [...cart];

    wishlist.forEach((food) => {
      const existing = updatedCart.find(
        (item) =>
          item.id === food.id &&
          item.restaurantId ===
            food.restaurantId
      );

      if (existing) {
        updatedCart =
          updatedCart.map((item) =>
            item.id === food.id &&
            item.restaurantId ===
              food.restaurantId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
          );
      } else {
        updatedCart.push({
          ...food,
          quantity: 1,
        });
      }
    });

    saveCart(updatedCart);

    showToast(
      "All wishlist items added to cart"
    );
  };

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [cart]);

  if (wishlist.length === 0) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6 py-16">

        <div className="w-full max-w-xl rounded-4xl bg-white px-6 py-14 text-center shadow-sm sm:px-10">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
            <Heart
              size={42}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-7 text-3xl font-extrabold text-gray-900">
            Your wishlist is empty
          </h1>

          <p className="mx-auto mt-3 max-w-md leading-7 text-gray-500">
            Save dishes you love by tapping the
            heart icon while browsing the menu.
          </p>

          <button
            onClick={() =>
              navigate("/menu")
            }
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-semibold text-white transition hover:bg-orange-600"
          >
            Explore Food

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
        <div className="fixed right-5 top-24 z-100 flex max-w-[90%] items-center gap-3 rounded-2xl bg-zinc-900 px-5 py-4 text-sm font-medium text-white shadow-2xl">

          <CheckCircle2
            size={20}
            className="shrink-0 text-green-400"
          />

          {toast}

          <button
            onClick={() => setToast("")}
          >
            <X
              size={17}
              className="text-gray-400"
            />
          </button>

        </div>
      )}

      {/* HEADER */}
      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <p className="font-semibold text-orange-500">
                Saved Favorites
              </p>

              <h1 className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                My Wishlist
              </h1>

              <p className="mt-3 max-w-xl leading-7 text-gray-500">
                Keep your favorite dishes in one
                place and add them to your cart
                whenever you're ready.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={moveAllToCart}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <ShoppingBag size={18} />

                Add All to Cart
              </button>

              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={18} />

                Clear Wishlist
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <div className="mb-7 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold">
              Saved Dishes
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {wishlist.length}{" "}
              {wishlist.length === 1
                ? "item"
                : "items"}{" "}
              saved
            </p>

          </div>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {wishlist.map((food) => {
            const quantity =
              getQuantity(food);

            return (
              <article
                key={`${food.restaurantId}-${food.id}`}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* IMAGE */}
                <div className="relative overflow-hidden">

                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <button
                    onClick={() =>
                      removeFromWishlist(food)
                    }
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
                    title="Remove from wishlist"
                  >
                    <Heart
                      size={19}
                      className="fill-red-500 text-red-500"
                    />
                  </button>

                  {food.bestseller && (
                    <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow">
                      Bestseller
                    </span>
                  )}

                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2">

                      <span
                        className={`flex h-5 w-5 items-center justify-center border-2 ${
                          food.veg
                            ? "border-green-600"
                            : "border-red-600"
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            food.veg
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        />
                      </span>

                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {food.category}
                      </span>

                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-sm font-semibold text-green-700">

                      <Star
                        size={13}
                        className="fill-green-600 text-green-600"
                      />

                      {food.rating}

                    </div>

                  </div>

                  <h3 className="mt-4 text-xl font-extrabold text-gray-900">
                    {food.name}
                  </h3>

                  {/* RESTAURANT */}
                  <button
                    onClick={() =>
                      navigate(
                        `/restaurants/${food.restaurantId}`
                      )
                    }
                    className="mt-2 flex items-center gap-2 text-sm font-medium text-orange-500 transition hover:text-orange-600"
                  >
                    <Store size={15} />

                    {food.restaurantName}
                  </button>

                  <p className="mt-3 min-h-18 text-sm leading-6 text-gray-500">
                    {food.description}
                  </p>

                  {food.deliveryTime && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">

                      <Clock size={15} />

                      {food.deliveryTime}

                    </div>
                  )}

                  {/* PRICE */}
                  <div className="mt-5 flex items-center justify-between border-t pt-5">

                    <div>

                      <p className="text-xs text-gray-400">
                        Price
                      </p>

                      <p className="text-xl font-extrabold text-gray-900">
                        ₹{food.price}
                      </p>

                    </div>

                    {quantity === 0 ? (
                      <button
                        onClick={() =>
                          addToCart(food)
                        }
                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center overflow-hidden rounded-xl border border-orange-200 bg-orange-50">

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              food
                            )
                          }
                          className="p-2.5 text-orange-600 transition hover:bg-orange-100"
                        >
                          <Minus size={17} />
                        </button>

                        <span className="min-w-9 text-center text-sm font-bold text-orange-600">
                          {quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              food
                            )
                          }
                          className="p-2.5 text-orange-600 transition hover:bg-orange-100"
                        >
                          <Plus size={17} />
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </section>

      {/* FLOATING CART */}
      {cartCount > 0 && (
        <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-32px)] max-w-xl -translate-x-1/2">

          <button
            onClick={() =>
              navigate("/cart")
            }
            className="flex w-full items-center justify-between rounded-2xl bg-zinc-900 px-5 py-4 text-white shadow-2xl"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                <ShoppingBag size={20} />
              </div>

              <div className="text-left">

                <p className="font-bold">
                  {cartCount}{" "}
                  {cartCount === 1
                    ? "item"
                    : "items"}
                </p>

                <p className="text-xs text-gray-400">
                  ₹{cartTotal}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 font-semibold">

              View Cart

              <ArrowRight size={18} />

            </div>

          </button>

        </div>
      )}

    </div>
  );
}

export default Wishlist;