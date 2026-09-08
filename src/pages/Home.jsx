import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Bike,
  Clock,
  Search,
  ShoppingBag,
  Star,
  Tag,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const categories = [
    {
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Burgers",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Fast Food",
      image:
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Desserts",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Beverages",
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Healthy",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const restaurants = [
    {
      id: 1,
      name: "The Burger House",
      cuisine: "Burgers • Fast Food • Beverages",
      rating: 4.7,
      time: "25-30 min",
      status: "Open",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      name: "Italiano Pizza",
      cuisine: "Pizza • Italian • Pasta",
      rating: 4.8,
      time: "30-40 min",
      status: "Open",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      name: "Spice Kitchen",
      cuisine: "Indian • Biryani • North Indian",
      rating: 4.6,
      time: "20-30 min",
      status: "Open",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 4,
      name: "Green Bowl",
      cuisine: "Healthy • Salads • Vegan",
      rating: 4.5,
      time: "20-25 min",
      status: "Open",
      image:
        "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const featuredFoods = [
    {
      id: 1,
      name: "Classic Cheese Burger",
      restaurant: "The Burger House",
      category: "Burger",
      price: 199,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 2,
      name: "Pepperoni Pizza",
      restaurant: "Italiano Pizza",
      category: "Pizza",
      price: 349,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 3,
      name: "Chicken Biryani",
      restaurant: "Spice Kitchen",
      category: "Indian",
      price: 279,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 4,
      name: "Healthy Veg Bowl",
      restaurant: "Green Bowl",
      category: "Healthy",
      price: 249,
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/menu?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <main>

        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-orange-50">
          <div className="mx-auto grid min-h-162.5 max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:px-8">

            {/* Hero Content */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
                <Bike size={18} />
                Fast & Fresh Delivery
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Delicious food,
                <span className="text-orange-500"> delivered </span>
                to your door
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                Order your favorite meals from the best restaurants near you.
                Fresh food, great prices and fast delivery.
              </p>

              {/* Search */}
              <form
                onSubmit={handleSearch}
                className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg sm:flex-row"
              >
                <div className="flex flex-1 items-center gap-3 px-3">
                  <Search className="text-gray-400" size={21} />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search pizza, burger, biryani..."
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-orange-500 px-7 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  Search Food
                </button>
              </form>

              <div className="mt-7 flex flex-wrap gap-6 text-sm text-gray-600">

                <div className="flex items-center gap-2">
                  <Clock className="text-orange-500" size={19} />
                  30 min delivery
                </div>

                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-orange-500" size={19} />
                  500+ dishes
                </div>

                <div className="flex items-center gap-2">
                  <Star
                    className="fill-orange-500 text-orange-500"
                    size={19}
                  />
                  Top rated restaurants
                </div>

              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">

              <div className="overflow-hidden rounded-[40px] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85"
                  alt="Food delivery"
                  className="h-87.5 w-full object-cover sm:h-125"
                />
              </div>

              <div className="absolute -bottom-6 left-3 rounded-2xl bg-white p-4 shadow-xl sm:left-7.5">
                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-green-100 p-3">
                    <Bike className="text-green-600" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Average delivery
                    </p>

                    <p className="font-bold text-gray-900">
                      25-30 Minutes
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 font-semibold text-orange-500">
                  Browse Categories
                </p>

                <h2 className="text-3xl font-bold sm:text-4xl">
                  What are you craving?
                </h2>
              </div>

              <button
                onClick={() => navigate("/menu")}
                className="hidden items-center gap-2 font-semibold text-orange-500 sm:flex"
              >
                View All
                <ArrowRight size={19} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() =>
                    navigate(
                      `/menu?category=${encodeURIComponent(category.name)}`
                    )
                  }
                  className="group rounded-3xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-2 hover:shadow-lg"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="mx-auto h-24 w-24 rounded-full object-cover transition duration-300 group-hover:scale-105"
                  />

                  <h3 className="mt-4 font-semibold text-gray-800">
                    {category.name}
                  </h3>
                </button>
              ))}

            </div>
          </div>
        </section>

        {/* PROMOTIONAL BANNER */}
        <section className="px-6 py-4">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[35px] bg-orange-500">

            <div className="grid items-center gap-6 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">

              <div className="text-white">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                  <Tag size={18} />
                  Special Offer
                </div>

                <h2 className="text-3xl font-bold sm:text-5xl">
                  Get 40% OFF on your first order
                </h2>

                <p className="mt-5 max-w-lg text-lg text-orange-50">
                  Discover amazing food from restaurants around you and enjoy
                  a special discount on your first order.
                </p>

                <button
                  onClick={() => navigate("/menu")}
                  className="mt-7 rounded-xl bg-white px-7 py-3.5 font-bold text-orange-500 transition hover:bg-orange-50"
                >
                  Order Now
                </button>
              </div>

              <div className="flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
                  alt="Special food offer"
                  className="h-70 w-full max-w-lg rounded-3xl object-cover shadow-xl"
                />
              </div>

            </div>
          </div>
        </section>

        {/* POPULAR RESTAURANTS */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 font-semibold text-orange-500">
                  Popular Restaurants
                </p>

                <h2 className="text-3xl font-bold sm:text-4xl">
                  Top restaurants near you
                </h2>
              </div>

              <button
                onClick={() => navigate("/restaurants")}
                className="hidden items-center gap-2 font-semibold text-orange-500 sm:flex"
              >
                View Restaurants
                <ArrowRight size={19} />
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() =>
                    navigate(`/restaurants/${restaurant.id}`)
                  }
                  className="cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="relative">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-48 w-full object-cover"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                      {restaurant.status}
                    </span>
                  </div>

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold">
                        {restaurant.name}
                      </h3>

                      <div className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 text-sm font-semibold text-green-700">
                        <Star
                          size={14}
                          className="fill-green-600 text-green-600"
                        />

                        {restaurant.rating}
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      {restaurant.cuisine}
                    </p>

                    <div className="mt-4 flex items-center gap-2 border-t pt-4 text-sm text-gray-600">
                      <Clock size={17} className="text-orange-500" />

                      {restaurant.time}
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* FEATURED FOODS */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="mb-10 text-center">

              <p className="mb-2 font-semibold text-orange-500">
                Popular Choices
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Featured Food
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                Delicious dishes loved by our customers from popular
                restaurants.
              </p>

            </div>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

              {featuredFoods.map((food) => (
                <div
                  key={food.id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="relative">

                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-56 w-full object-cover"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-orange-500 shadow">
                      {food.category}
                    </span>

                  </div>

                  <div className="p-5">

                    <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-orange-500">
                      <Star
                        size={16}
                        className="fill-orange-500 text-orange-500"
                      />

                      {food.rating}
                    </div>

                    <h3 className="text-xl font-bold">
                      {food.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {food.restaurant}
                    </p>

                    <div className="mt-5 flex items-center justify-between">

                      <p className="text-xl font-bold text-orange-500">
                        ₹{food.price}
                      </p>

                      <button
                        onClick={() => navigate("/menu")}
                        className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                      >
                        Add to Cart
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-orange-50 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            <div className="mb-12 text-center">

              <p className="font-semibold text-orange-500">
                Simple & Fast
              </p>

              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                How FoodRush Works
              </h2>

            </div>

            <div className="grid gap-8 md:grid-cols-3">

              <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                  <Search className="text-orange-500" size={30} />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Choose Your Food
                </h3>

                <p className="mt-3 leading-7 text-gray-500">
                  Browse restaurants and find delicious food that matches your
                  taste.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                  <ShoppingBag className="text-orange-500" size={30} />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Place Your Order
                </h3>

                <p className="mt-3 leading-7 text-gray-500">
                  Add your favorite dishes to the cart and complete your order.
                </p>
              </div>

              <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">
                  <Bike className="text-orange-500" size={30} />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  Fast Delivery
                </h3>

                <p className="mt-3 leading-7 text-gray-500">
                  Relax while your food is prepared and delivered to your
                  doorstep.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 text-center">

            <h2 className="text-3xl font-bold sm:text-5xl">
              Hungry? Your favorite food is just a few clicks away.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
              Explore hundreds of delicious dishes and get your meal delivered
              quickly.
            </p>

            <button
              onClick={() => navigate("/menu")}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600"
            >
              Explore Food
              <ArrowRight size={20} />
            </button>

          </div>
        </section>

      </main>

    </>
  );
}

export default Home;