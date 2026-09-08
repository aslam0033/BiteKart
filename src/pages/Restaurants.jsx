import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  Clock,
  SlidersHorizontal,
  X,
  ArrowRight,
} from "lucide-react";

function Restaurants() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [rating, setRating] = useState("All");
  const [deliveryTime, setDeliveryTime] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const restaurants = [
    {
      id: 1,
      name: "The Burger House",
      cuisine: "Burgers",
      description: "Juicy burgers, crispy fries and refreshing drinks.",
      rating: 4.7,
      deliveryTime: 25,
      status: "Open",
      priceForTwo: 450,
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      name: "Italiano Pizza",
      cuisine: "Pizza",
      description: "Authentic Italian pizzas, pasta and delicious sides.",
      rating: 4.8,
      deliveryTime: 35,
      status: "Open",
      priceForTwo: 600,
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      name: "Spice Kitchen",
      cuisine: "Indian",
      description: "Flavorful Indian curries, biryani and traditional meals.",
      rating: 4.6,
      deliveryTime: 28,
      status: "Open",
      priceForTwo: 500,
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      name: "Green Bowl",
      cuisine: "Healthy",
      description: "Healthy bowls, fresh salads and nutritious meals.",
      rating: 4.5,
      deliveryTime: 22,
      status: "Open",
      priceForTwo: 400,
      image:
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 5,
      name: "Sweet Cravings",
      cuisine: "Desserts",
      description: "Cakes, pastries, brownies and creamy desserts.",
      rating: 4.4,
      deliveryTime: 30,
      status: "Open",
      priceForTwo: 350,
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 6,
      name: "Crunchy Bites",
      cuisine: "Fast Food",
      description: "Quick snacks, fried chicken, fries and wraps.",
      rating: 4.3,
      deliveryTime: 20,
      status: "Open",
      priceForTwo: 300,
      image:
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 7,
      name: "Royal Biryani",
      cuisine: "Indian",
      description: "Aromatic biryani prepared with premium spices and rice.",
      rating: 4.9,
      deliveryTime: 40,
      status: "Open",
      priceForTwo: 550,
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 8,
      name: "Cafe Brew",
      cuisine: "Beverages",
      description: "Coffee, cold drinks, shakes and quick bites.",
      rating: 4.2,
      deliveryTime: 18,
      status: "Closed",
      priceForTwo: 280,
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const cuisines = [
    "All",
    "Burgers",
    "Pizza",
    "Indian",
    "Healthy",
    "Desserts",
    "Fast Food",
    "Beverages",
  ];

  const filteredRestaurants = useMemo(() => {
    let data = [...restaurants];

    if (search.trim()) {
      data = data.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (cuisine !== "All") {
      data = data.filter((restaurant) => restaurant.cuisine === cuisine);
    }

    if (rating !== "All") {
      data = data.filter(
        (restaurant) => restaurant.rating >= Number(rating)
      );
    }

    if (deliveryTime !== "All") {
      if (deliveryTime === "20") {
        data = data.filter((restaurant) => restaurant.deliveryTime <= 20);
      }

      if (deliveryTime === "30") {
        data = data.filter((restaurant) => restaurant.deliveryTime <= 30);
      }

      if (deliveryTime === "40") {
        data = data.filter((restaurant) => restaurant.deliveryTime <= 40);
      }
    }

    if (availability !== "All") {
      data = data.filter(
        (restaurant) => restaurant.status === availability
      );
    }

    if (sortBy === "rating") {
      data.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "delivery") {
      data.sort((a, b) => a.deliveryTime - b.deliveryTime);
    }

    if (sortBy === "priceLow") {
      data.sort((a, b) => a.priceForTwo - b.priceForTwo);
    }

    if (sortBy === "priceHigh") {
      data.sort((a, b) => b.priceForTwo - a.priceForTwo);
    }

    return data;
  }, [
    search,
    cuisine,
    rating,
    deliveryTime,
    availability,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCuisine("All");
    setRating("All");
    setDeliveryTime("All");
    setAvailability("All");
    setSortBy("rating");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <section className="bg-orange-500">
        <div className="mx-auto max-w-7xl px-6 py-16 text-white lg:px-8">

          <p className="mb-3 font-semibold text-orange-100">
            Discover Restaurants
          </p>

          <h1 className="text-4xl font-bold sm:text-5xl">
            Restaurants Near You
          </h1>

          <p className="mt-4 max-w-2xl text-orange-100">
            Browse top-rated restaurants and discover delicious meals from
            your favorite cuisines.
          </p>

          {/* Search */}
          <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lg">

            <Search className="text-gray-400" size={22} />

            <input
              type="text"
              placeholder="Search restaurants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-gray-800 outline-none"
            />

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Filter Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-2xl font-bold">
              All Restaurants
            </h2>

            <p className="mt-1 text-gray-500">
              {filteredRestaurants.length} restaurants found
            </p>
          </div>

          <div className="flex items-center gap-3">

            <label className="text-sm font-medium text-gray-600">
              Sort by:
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
            >
              <option value="rating">Highest Rating</option>
              <option value="delivery">Fastest Delivery</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>

          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

          {/* Filters */}
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-2">
                <SlidersHorizontal size={20} />
                <h3 className="font-bold">
                  Filters
                </h3>
              </div>

              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-orange-500 hover:text-orange-600"
              >
                Clear
              </button>

            </div>

            {/* Cuisine */}
            <div className="border-b pb-6">

              <h4 className="mb-4 font-semibold">
                Cuisine
              </h4>

              <div className="space-y-3">

                {cuisines.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="cuisine"
                      value={item}
                      checked={cuisine === item}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="accent-orange-500"
                    />

                    <span className="text-sm text-gray-600">
                      {item}
                    </span>
                  </label>
                ))}

              </div>
            </div>

            {/* Rating */}
            <div className="border-b py-6">

              <h4 className="mb-4 font-semibold">
                Minimum Rating
              </h4>

              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="All">All Ratings</option>
                <option value="4">4.0 & above</option>
                <option value="4.5">4.5 & above</option>
                <option value="4.7">4.7 & above</option>
              </select>

            </div>

            {/* Delivery */}
            <div className="border-b py-6">

              <h4 className="mb-4 font-semibold">
                Delivery Time
              </h4>

              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="All">Any Time</option>
                <option value="20">Under 20 min</option>
                <option value="30">Under 30 min</option>
                <option value="40">Under 40 min</option>
              </select>

            </div>

            {/* Availability */}
            <div className="pt-6">

              <h4 className="mb-4 font-semibold">
                Availability
              </h4>

              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              >
                <option value="All">All</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>

            </div>

          </aside>

          {/* Restaurant Cards */}
          <div>

            {filteredRestaurants.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    <div className="relative overflow-hidden">

                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                          restaurant.status === "Open"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {restaurant.status}
                      </span>

                    </div>

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <h3 className="text-xl font-bold">
                            {restaurant.name}
                          </h3>

                          <p className="mt-1 text-sm font-medium text-orange-500">
                            {restaurant.cuisine}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-sm font-semibold text-green-700">

                          <Star
                            size={14}
                            className="fill-green-600 text-green-600"
                          />

                          {restaurant.rating}

                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                        {restaurant.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t pt-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock
                            size={17}
                            className="text-orange-500"
                          />

                          {restaurant.deliveryTime} min
                        </div>

                        <p className="text-sm text-gray-600">
                          ₹{restaurant.priceForTwo} for two
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          navigate(`/restaurants/${restaurant.id}`)
                        }
                        disabled={restaurant.status === "Closed"}
                        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${
                          restaurant.status === "Open"
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "cursor-not-allowed bg-gray-200 text-gray-500"
                        }`}
                      >
                        {restaurant.status === "Open"
                          ? "View Menu"
                          : "Currently Closed"}

                        {restaurant.status === "Open" && (
                          <ArrowRight size={18} />
                        )}
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <div className="flex min-h-100 flex-col items-center justify-center rounded-3xl bg-white px-6 text-center shadow-sm">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <Search
                    size={28}
                    className="text-orange-500"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No restaurants found
                </h3>

                <p className="mt-2 max-w-md text-gray-500">
                  Try changing your search or filters to find more restaurants.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white"
                >
                  <X size={18} />
                  Clear Filters
                </button>

              </div>
            )}

          </div>

        </div>
      </section>
    </div>
  );
}

export default Restaurants;