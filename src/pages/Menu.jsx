import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Store,
  X,
} from "lucide-react";

/* =====================================================
   FOOD DATA
===================================================== */

const foods = [
  {
    id: 101,
    restaurantId: 1,
    restaurantName: "The Burger House",
    name: "Classic Cheese Burger",
    category: "Burgers",
    description:
      "Juicy grilled patty with cheese, lettuce, tomato, onions and signature burger sauce.",
    price: 199,
    rating: 4.8,
    popularity: 98,
    veg: false,
    bestseller: true,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 102,
    restaurantId: 1,
    restaurantName: "The Burger House",
    name: "Crispy Veg Burger",
    category: "Burgers",
    description:
      "Crispy vegetable patty layered with fresh lettuce, tomato and creamy sauce.",
    price: 149,
    rating: 4.5,
    popularity: 85,
    veg: true,
    bestseller: false,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 201,
    restaurantId: 2,
    restaurantName: "Italiano Pizza",
    name: "Margherita Pizza",
    category: "Pizza",
    description:
      "Classic pizza topped with rich tomato sauce, mozzarella cheese and Italian herbs.",
    price: 249,
    rating: 4.7,
    popularity: 93,
    veg: true,
    bestseller: true,
    deliveryTime: "30-40 min",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 202,
    restaurantId: 2,
    restaurantName: "Italiano Pizza",
    name: "Pepperoni Pizza",
    category: "Pizza",
    description:
      "Loaded with pepperoni, mozzarella cheese and flavorful Italian pizza sauce.",
    price: 349,
    rating: 4.9,
    popularity: 100,
    veg: false,
    bestseller: true,
    deliveryTime: "30-40 min",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 301,
    restaurantId: 3,
    restaurantName: "Spice Kitchen",
    name: "Butter Chicken",
    category: "Indian",
    description:
      "Tender chicken simmered in rich tomato, butter and creamy Indian gravy.",
    price: 299,
    rating: 4.8,
    popularity: 96,
    veg: false,
    bestseller: true,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 302,
    restaurantId: 3,
    restaurantName: "Spice Kitchen",
    name: "Paneer Butter Masala",
    category: "Indian",
    description:
      "Soft paneer cubes cooked in creamy tomato gravy with aromatic Indian spices.",
    price: 249,
    rating: 4.7,
    popularity: 91,
    veg: true,
    bestseller: true,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 303,
    restaurantId: 3,
    restaurantName: "Spice Kitchen",
    name: "Chicken Biryani",
    category: "Biryani",
    description:
      "Fragrant basmati rice cooked with marinated chicken and authentic Indian spices.",
    price: 279,
    rating: 4.8,
    popularity: 99,
    veg: false,
    bestseller: true,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 401,
    restaurantId: 4,
    restaurantName: "Green Bowl",
    name: "Protein Power Bowl",
    category: "Healthy Meals",
    description:
      "Protein-rich meal bowl with fresh vegetables, grains, greens and house dressing.",
    price: 259,
    rating: 4.8,
    popularity: 88,
    veg: true,
    bestseller: true,
    deliveryTime: "20-25 min",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 402,
    restaurantId: 4,
    restaurantName: "Green Bowl",
    name: "Fresh Garden Salad",
    category: "Healthy Meals",
    description:
      "Fresh lettuce, cucumber, tomatoes, olives and house-made dressing.",
    price: 189,
    rating: 4.5,
    popularity: 75,
    veg: true,
    bestseller: false,
    deliveryTime: "20-25 min",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 501,
    restaurantId: 5,
    restaurantName: "Sweet Cravings",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    description:
      "Warm chocolate cake with a soft center filled with rich molten chocolate.",
    price: 179,
    rating: 4.8,
    popularity: 95,
    veg: true,
    bestseller: true,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 502,
    restaurantId: 5,
    restaurantName: "Sweet Cravings",
    name: "Strawberry Cheesecake",
    category: "Desserts",
    description:
      "Smooth and creamy cheesecake topped with sweet strawberry sauce.",
    price: 199,
    rating: 4.7,
    popularity: 89,
    veg: true,
    bestseller: false,
    deliveryTime: "25-30 min",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 601,
    restaurantId: 6,
    restaurantName: "Crunchy Bites",
    name: "Crispy Fried Chicken",
    category: "Fast Food",
    description:
      "Golden fried chicken coated with crunchy seasoning and signature spices.",
    price: 229,
    rating: 4.7,
    popularity: 94,
    veg: false,
    bestseller: true,
    deliveryTime: "20 min",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 602,
    restaurantId: 6,
    restaurantName: "Crunchy Bites",
    name: "Paneer Wrap",
    category: "Fast Food",
    description:
      "Soft wrap loaded with spicy paneer, fresh vegetables and creamy sauce.",
    price: 169,
    rating: 4.5,
    popularity: 80,
    veg: true,
    bestseller: false,
    deliveryTime: "20 min",
    image:
      "https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 701,
    restaurantId: 7,
    restaurantName: "Royal Biryani",
    name: "Royal Chicken Biryani",
    category: "Biryani",
    description:
      "Slow-cooked dum biryani prepared with fragrant rice, tender chicken and spices.",
    price: 299,
    rating: 4.9,
    popularity: 100,
    veg: false,
    bestseller: true,
    deliveryTime: "35-40 min",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 702,
    restaurantId: 7,
    restaurantName: "Royal Biryani",
    name: "Veg Dum Biryani",
    category: "Biryani",
    description:
      "Aromatic basmati rice slow-cooked with vegetables and traditional spices.",
    price: 229,
    rating: 4.5,
    popularity: 82,
    veg: true,
    bestseller: false,
    deliveryTime: "35-40 min",
    image:
      "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 801,
    restaurantId: 8,
    restaurantName: "Cafe Brew",
    name: "Cappuccino",
    category: "Beverages",
    description:
      "Fresh espresso topped with steamed milk and a smooth layer of milk foam.",
    price: 129,
    rating: 4.6,
    popularity: 87,
    veg: true,
    bestseller: true,
    deliveryTime: "15-20 min",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 802,
    restaurantId: 8,
    restaurantName: "Cafe Brew",
    name: "Cold Coffee",
    category: "Beverages",
    description:
      "Chilled creamy coffee blended until smooth and refreshingly delicious.",
    price: 149,
    rating: 4.7,
    popularity: 90,
    veg: true,
    bestseller: false,
    deliveryTime: "15-20 min",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80",
  },
];

const categories = [
  "All",
  "Pizza",
  "Burgers",
  "Biryani",
  "Indian",
  "Fast Food",
  "Desserts",
  "Beverages",
  "Healthy Meals",
];

function Menu() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialSearch =
    searchParams.get("search") || "";

  const initialCategory =
    searchParams.get("category") || "All";

  const [search, setSearch] =
    useState(initialSearch);

  const [category, setCategory] = useState(
    categories.includes(initialCategory)
      ? initialCategory
      : "All"
  );

  const [foodType, setFoodType] =
    useState("All");

  const [priceRange, setPriceRange] =
    useState("All");

  const [rating, setRating] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("popular");

  const [mobileFilters, setMobileFilters] =
    useState(false);

  const [toast, setToast] = useState("");

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

  const [wishlist, setWishlist] = useState(
    () => {
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
    }
  );

  /* =====================================================
     FILTERING
  ===================================================== */

  const filteredFoods = useMemo(() => {
    let result = [...foods];

    const query = search
      .trim()
      .toLowerCase();

    if (query) {
      result = result.filter(
        (food) =>
          food.name
            .toLowerCase()
            .includes(query) ||
          food.restaurantName
            .toLowerCase()
            .includes(query)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (food) => food.category === category
      );
    }

    if (foodType === "Veg") {
      result = result.filter(
        (food) => food.veg
      );
    }

    if (foodType === "Non-Veg") {
      result = result.filter(
        (food) => !food.veg
      );
    }

    if (priceRange === "under200") {
      result = result.filter(
        (food) => food.price < 200
      );
    }

    if (priceRange === "200to300") {
      result = result.filter(
        (food) =>
          food.price >= 200 &&
          food.price <= 300
      );
    }

    if (priceRange === "above300") {
      result = result.filter(
        (food) => food.price > 300
      );
    }

    if (rating !== "All") {
      result = result.filter(
        (food) =>
          food.rating >= Number(rating)
      );
    }

    if (sortBy === "popular") {
      result.sort(
        (a, b) =>
          b.popularity - a.popularity
      );
    }

    if (sortBy === "rating") {
      result.sort(
        (a, b) => b.rating - a.rating
      );
    }

    if (sortBy === "priceLow") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "priceHigh") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    return result;
  }, [
    search,
    category,
    foodType,
    priceRange,
    rating,
    sortBy,
  ]);

  /* =====================================================
     HELPERS
  ===================================================== */

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
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

  /* =====================================================
     CART
  ===================================================== */

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

  /* =====================================================
     WISHLIST
  ===================================================== */

  const toggleWishlist = (food) => {
    const exists = wishlist.some(
      (item) =>
        item.id === food.id &&
        item.restaurantId ===
          food.restaurantId
    );

    let updatedWishlist;

    if (exists) {
      updatedWishlist =
        wishlist.filter(
          (item) =>
            !(
              item.id === food.id &&
              item.restaurantId ===
                food.restaurantId
            )
        );

      showToast(
        `${food.name} removed from wishlist`
      );
    } else {
      updatedWishlist = [
        ...wishlist,
        food,
      ];

      showToast(
        `${food.name} added to wishlist`
      );
    }

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "foodrush-wishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const isWishlisted = (food) => {
    return wishlist.some(
      (item) =>
        item.id === food.id &&
        item.restaurantId ===
          food.restaurantId
    );
  };

  /* =====================================================
     RESET
  ===================================================== */

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setFoodType("All");
    setPriceRange("All");
    setRating("All");
    setSortBy("popular");
  };

  const activeFilterCount = [
    category !== "All",
    foodType !== "All",
    priceRange !== "All",
    rating !== "All",
  ].filter(Boolean).length;

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  /* =====================================================
     FILTER UI
  ===================================================== */

  const FilterContent = () => (
    <>
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} />

          <h3 className="font-bold">
            Filters
          </h3>
        </div>

        <button
          onClick={clearFilters}
          className="text-sm font-semibold text-orange-500 transition hover:text-orange-600"
        >
          Clear All
        </button>

      </div>

      {/* FOOD TYPE */}
      <div className="mt-7 border-t pt-6">

        <h4 className="mb-4 font-semibold">
          Food Type
        </h4>

        <div className="space-y-3">

          {["All", "Veg", "Non-Veg"].map(
            (type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="radio"
                  name="foodType"
                  value={type}
                  checked={
                    foodType === type
                  }
                  onChange={(e) =>
                    setFoodType(
                      e.target.value
                    )
                  }
                  className="accent-orange-500"
                />

                <span className="text-sm text-gray-600">
                  {type}
                </span>
              </label>
            )
          )}

        </div>

      </div>

      {/* PRICE */}
      <div className="mt-6 border-t pt-6">

        <h4 className="mb-4 font-semibold">
          Price Range
        </h4>

        <div className="space-y-3">

          {[
            {
              value: "All",
              label: "All Prices",
            },
            {
              value: "under200",
              label: "Under ₹200",
            },
            {
              value: "200to300",
              label: "₹200 - ₹300",
            },
            {
              value: "above300",
              label: "Above ₹300",
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="radio"
                name="price"
                value={option.value}
                checked={
                  priceRange ===
                  option.value
                }
                onChange={(e) =>
                  setPriceRange(
                    e.target.value
                  )
                }
                className="accent-orange-500"
              />

              <span className="text-sm text-gray-600">
                {option.label}
              </span>
            </label>
          ))}

        </div>

      </div>

      {/* RATING */}
      <div className="mt-6 border-t pt-6">

        <h4 className="mb-4 font-semibold">
          Minimum Rating
        </h4>

        <select
          value={rating}
          onChange={(e) =>
            setRating(e.target.value)
          }
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
        >
          <option value="All">
            All Ratings
          </option>

          <option value="4">
            4.0 & above
          </option>

          <option value="4.5">
            4.5 & above
          </option>

          <option value="4.7">
            4.7 & above
          </option>

          <option value="4.8">
            4.8 & above
          </option>
        </select>

      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =================================================
          TOAST
      ================================================= */}

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

      {/* =================================================
          HERO
      ================================================= */}

      <section className="overflow-hidden bg-orange-500">

        <div className="mx-auto max-w-7xl px-6 py-14 text-white lg:px-8 lg:py-16">

          <p className="font-semibold text-orange-100">
            Explore Food
          </p>

          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
            Find your next favorite meal
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-orange-100">
            Browse delicious dishes from
            restaurants around you and order
            exactly what you're craving.
          </p>

          {/* SEARCH */}
          <div className="mt-8 flex max-w-3xl items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl">

            <Search
              size={22}
              className="shrink-0 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search pizza, burger, biryani or restaurant..."
              className="w-full bg-transparent text-gray-800 outline-none"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                <X
                  size={19}
                  className="text-gray-400"
                />
              </button>
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          CATEGORIES
      ================================================= */}

      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-5 lg:px-8">

          <div className="flex gap-3 overflow-x-auto pb-1">

            {categories.map((item) => (
              <button
                key={item}
                onClick={() =>
                  setCategory(item)
                }
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  category === item
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-9 lg:px-8">

        {/* TOP CONTROLS */}
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>

            <h2 className="text-2xl font-extrabold text-gray-900">
              {category === "All"
                ? "All Food"
                : category}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {filteredFoods.length}{" "}
              {filteredFoods.length === 1
                ? "dish"
                : "dishes"}{" "}
              available
            </p>

          </div>

          <div className="flex items-center gap-3">

            {/* MOBILE FILTER */}
            <button
              onClick={() =>
                setMobileFilters(true)
              }
              className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold lg:hidden"
            >
              <Filter size={18} />

              Filters

              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* SORT */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
            >
              <option value="popular">
                Most Popular
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="priceLow">
                Price: Low to High
              </option>

              <option value="priceHigh">
                Price: High to Low
              </option>
            </select>

          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">

          {/* =================================================
              DESKTOP SIDEBAR
          ================================================= */}

          <aside className="hidden h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:block">

            <FilterContent />

          </aside>

          {/* =================================================
              FOOD RESULTS
          ================================================= */}

          <div>

            {filteredFoods.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {filteredFoods.map(
                  (food) => {
                    const quantity =
                      getQuantity(food);

                    const favorite =
                      isWishlisted(food);

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
                              toggleWishlist(
                                food
                              )
                            }
                            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
                          >
                            <Heart
                              size={19}
                              className={
                                favorite
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600"
                              }
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

                          {/* FOOD TYPE */}
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
                                {
                                  food.category
                                }
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
                            <Store
                              size={15}
                            />

                            {
                              food.restaurantName
                            }
                          </button>

                          <p className="mt-3 min-h-18 text-sm leading-6 text-gray-500">
                            {food.description}
                          </p>

                          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">

                            <Clock
                              size={15}
                            />

                            {
                              food.deliveryTime
                            }

                          </div>

                          {/* PRICE + CART */}
                          <div className="mt-5 flex items-center justify-between gap-4 border-t pt-5">

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
                                  addToCart(
                                    food
                                  )
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
                                  <Minus
                                    size={17}
                                  />
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
                                  <Plus
                                    size={17}
                                  />
                                </button>

                              </div>
                            )}

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            ) : (
              <div className="flex min-h-112.5 flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-sm">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                  <Search
                    size={32}
                    className="text-orange-500"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  No food found
                </h3>

                <p className="mt-2 max-w-md leading-7 text-gray-500">
                  We couldn't find dishes matching
                  your current search and filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Reset Filters
                </button>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          MOBILE FILTER DRAWER
      ================================================= */}

      {mobileFilters && (
        <div className="fixed inset-0 z-120 lg:hidden">

          <div
            onClick={() =>
              setMobileFilters(false)
            }
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-[30px] bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Filter Food
              </h2>

              <button
                onClick={() =>
                  setMobileFilters(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <FilterContent />

            <button
              onClick={() =>
                setMobileFilters(false)
              }
              className="mt-8 w-full rounded-xl bg-orange-500 py-4 font-bold text-white"
            >
              Show {filteredFoods.length}{" "}
              Results
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          CART FLOATING BAR
      ================================================= */}

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

              <ChevronRight size={18} />
            </div>

          </button>

        </div>
      )}

    </div>
  );
}

export default Menu;