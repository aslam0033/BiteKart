import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock,
  Heart,
  IndianRupee,
  Info,
  MapPin,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Store,
  X,
} from "lucide-react";

/* ---------------------------------------------
   RESTAURANT DATA
--------------------------------------------- */

const restaurants = {
  1: {
    id: 1,
    name: "The Burger House",
    cuisine: "Burgers",
    cuisines: "Burgers • Fast Food • Beverages",
    description:
      "Juicy handcrafted burgers, crispy fries, loaded sides and refreshing drinks prepared fresh for every order.",
    rating: 4.7,
    reviews: "2.8K",
    deliveryTime: "25-30 min",
    distance: "2.3 km",
    priceForTwo: 450,
    status: "Open",
    address: "Station Road, Jamkhandi",
    offer: "40% OFF up to ₹100",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=85",
  },

  2: {
    id: 2,
    name: "Italiano Pizza",
    cuisine: "Pizza",
    cuisines: "Pizza • Italian • Pasta",
    description:
      "Authentic Italian pizzas baked with fresh toppings, signature sauces and perfectly melted cheese.",
    rating: 4.8,
    reviews: "3.4K",
    deliveryTime: "30-40 min",
    distance: "3.1 km",
    priceForTwo: 600,
    status: "Open",
    address: "College Road, Jamkhandi",
    offer: "₹125 OFF above ₹499",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85",
  },

  3: {
    id: 3,
    name: "Spice Kitchen",
    cuisine: "Indian",
    cuisines: "Indian • Biryani • North Indian",
    description:
      "Rich Indian flavors, aromatic biryanis and traditional curries made with authentic spices.",
    rating: 4.6,
    reviews: "2.1K",
    deliveryTime: "25-30 min",
    distance: "1.8 km",
    priceForTwo: 500,
    status: "Open",
    address: "Market Road, Jamkhandi",
    offer: "20% OFF on orders above ₹399",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85",
  },

  4: {
    id: 4,
    name: "Green Bowl",
    cuisine: "Healthy",
    cuisines: "Healthy • Salads • Vegan",
    description:
      "Fresh, colorful and nutritious meals packed with wholesome ingredients and delicious flavors.",
    rating: 4.5,
    reviews: "1.5K",
    deliveryTime: "20-25 min",
    distance: "2.5 km",
    priceForTwo: 400,
    status: "Open",
    address: "Vijayapura Road, Jamkhandi",
    offer: "Free delivery above ₹299",
    image:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1400&q=85",
  },

  5: {
    id: 5,
    name: "Sweet Cravings",
    cuisine: "Desserts",
    cuisines: "Desserts • Cakes • Ice Cream",
    description:
      "Indulgent cakes, creamy desserts, brownies and sweet treats for every celebration.",
    rating: 4.4,
    reviews: "1.9K",
    deliveryTime: "25-30 min",
    distance: "3.4 km",
    priceForTwo: 350,
    status: "Open",
    address: "Bus Stand Road, Jamkhandi",
    offer: "Buy 2 desserts & get 10% OFF",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1400&q=85",
  },

  6: {
    id: 6,
    name: "Crunchy Bites",
    cuisine: "Fast Food",
    cuisines: "Fast Food • Fried Chicken • Wraps",
    description:
      "Crispy fried favorites, loaded wraps and satisfying quick bites made for serious cravings.",
    rating: 4.3,
    reviews: "1.7K",
    deliveryTime: "20 min",
    distance: "1.5 km",
    priceForTwo: 300,
    status: "Open",
    address: "Main Bazaar, Jamkhandi",
    offer: "Flat ₹75 OFF above ₹299",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=1400&q=85",
  },

  7: {
    id: 7,
    name: "Royal Biryani",
    cuisine: "Biryani",
    cuisines: "Biryani • Indian • Mughlai",
    description:
      "Royal dum biryanis slow-cooked with fragrant basmati rice, premium spices and tender meat.",
    rating: 4.9,
    reviews: "5.2K",
    deliveryTime: "35-40 min",
    distance: "4.1 km",
    priceForTwo: 550,
    status: "Open",
    address: "Kudachi Road, Jamkhandi",
    offer: "25% OFF up to ₹150",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1400&q=85",
  },

  8: {
    id: 8,
    name: "Cafe Brew",
    cuisine: "Beverages",
    cuisines: "Coffee • Beverages • Quick Bites",
    description:
      "Freshly brewed coffee, creamy shakes and chilled beverages with delicious cafe-style snacks.",
    rating: 4.2,
    reviews: "980",
    deliveryTime: "15-20 min",
    distance: "2.9 km",
    priceForTwo: 280,
    status: "Closed",
    address: "College Circle, Jamkhandi",
    offer: "15% OFF on cafe combos",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1400&q=85",
  },
};

/* ---------------------------------------------
   MENU DATA
--------------------------------------------- */

const menuData = {
  Burgers: [
    {
      id: 101,
      name: "Classic Cheese Burger",
      category: "Burgers",
      description:
        "Grilled patty with cheese, lettuce, tomato, onions and signature sauce.",
      price: 199,
      rating: 4.8,
      veg: false,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 102,
      name: "Crispy Veg Burger",
      category: "Burgers",
      description:
        "Crispy vegetable patty layered with fresh lettuce and creamy sauce.",
      price: 149,
      rating: 4.5,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 103,
      name: "Loaded French Fries",
      category: "Sides",
      description:
        "Golden fries topped with cheese sauce, herbs and spicy seasoning.",
      price: 129,
      rating: 4.6,
      veg: true,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 104,
      name: "Chocolate Shake",
      category: "Beverages",
      description:
        "Rich and creamy chocolate milkshake topped with chocolate drizzle.",
      price: 119,
      rating: 4.4,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
    },
  ],

  Pizza: [
    {
      id: 201,
      name: "Margherita Pizza",
      category: "Pizza",
      description:
        "Classic pizza with tomato sauce, mozzarella cheese and Italian herbs.",
      price: 249,
      rating: 4.7,
      veg: true,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 202,
      name: "Pepperoni Pizza",
      category: "Pizza",
      description:
        "Loaded with pepperoni, mozzarella cheese and flavorful pizza sauce.",
      price: 349,
      rating: 4.9,
      veg: false,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 203,
      name: "Veg Supreme Pizza",
      category: "Pizza",
      description:
        "Bell peppers, onions, olives, corn and cheese on a crispy pizza base.",
      price: 299,
      rating: 4.6,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 204,
      name: "Cheesy Garlic Bread",
      category: "Sides",
      description:
        "Oven-baked garlic bread covered with melted mozzarella cheese.",
      price: 139,
      rating: 4.5,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=700&q=80",
    },
  ],

  Indian: [
    {
      id: 301,
      name: "Butter Chicken",
      category: "Main Course",
      description:
        "Tender chicken simmered in a rich buttery tomato and cream gravy.",
      price: 299,
      rating: 4.8,
      veg: false,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 302,
      name: "Paneer Butter Masala",
      category: "Main Course",
      description:
        "Soft paneer cubes cooked in creamy tomato gravy with Indian spices.",
      price: 249,
      rating: 4.7,
      veg: true,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 303,
      name: "Chicken Biryani",
      category: "Biryani",
      description:
        "Aromatic basmati rice cooked with marinated chicken and fragrant spices.",
      price: 279,
      rating: 4.8,
      veg: false,
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 304,
      name: "Garlic Naan",
      category: "Breads",
      description:
        "Soft tandoor-baked naan finished with garlic, butter and herbs.",
      price: 69,
      rating: 4.5,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80",
    },
  ],

  Healthy: [
    {
      id: 401,
      name: "Protein Power Bowl",
      category: "Healthy Meals",
      description:
        "Protein-rich bowl with vegetables, grains, greens and fresh dressing.",
      price: 259,
      rating: 4.8,
      veg: true,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 402,
      name: "Fresh Garden Salad",
      category: "Salads",
      description:
        "Fresh lettuce, cucumber, tomatoes, olives and house-made dressing.",
      price: 189,
      rating: 4.5,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 403,
      name: "Avocado Toast",
      category: "Breakfast",
      description:
        "Toasted multigrain bread topped with fresh avocado and seasoning.",
      price: 219,
      rating: 4.6,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 404,
      name: "Fruit Smoothie",
      category: "Beverages",
      description:
        "Refreshing smoothie made using seasonal fruits and natural ingredients.",
      price: 159,
      rating: 4.4,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=700&q=80",
    },
  ],

  Desserts: [
    {
      id: 501,
      name: "Chocolate Lava Cake",
      category: "Cakes",
      description:
        "Warm chocolate cake with a rich molten chocolate center.",
      price: 179,
      rating: 4.8,
      veg: true,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 502,
      name: "Chocolate Brownie",
      category: "Desserts",
      description:
        "Dense chocolate brownie with a soft fudgy center.",
      price: 129,
      rating: 4.6,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 503,
      name: "Strawberry Cheesecake",
      category: "Cakes",
      description:
        "Creamy cheesecake topped with fresh strawberry sauce.",
      price: 199,
      rating: 4.7,
      veg: true,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 504,
      name: "Vanilla Ice Cream",
      category: "Ice Cream",
      description:
        "Smooth and creamy classic vanilla ice cream.",
      price: 99,
      rating: 4.3,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80",
    },
  ],

  "Fast Food": [
    {
      id: 601,
      name: "Crispy Fried Chicken",
      category: "Chicken",
      description:
        "Crunchy golden fried chicken seasoned with our signature spices.",
      price: 229,
      rating: 4.7,
      veg: false,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 602,
      name: "Paneer Wrap",
      category: "Wraps",
      description:
        "Soft wrap filled with spicy paneer, crunchy vegetables and sauces.",
      price: 169,
      rating: 4.5,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 603,
      name: "Chicken Wrap",
      category: "Wraps",
      description:
        "Grilled chicken wrapped with vegetables and creamy signature sauce.",
      price: 189,
      rating: 4.6,
      veg: false,
      image:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 604,
      name: "Peri Peri Fries",
      category: "Sides",
      description:
        "Crispy fries tossed with spicy peri-peri seasoning.",
      price: 119,
      rating: 4.4,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80",
    },
  ],

  Biryani: [
    {
      id: 701,
      name: "Royal Chicken Biryani",
      category: "Biryani",
      description:
        "Slow-cooked dum biryani with fragrant basmati rice and tender chicken.",
      price: 299,
      rating: 4.9,
      veg: false,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 702,
      name: "Mutton Dum Biryani",
      category: "Biryani",
      description:
        "Royal mutton biryani layered with aromatic rice and traditional spices.",
      price: 379,
      rating: 4.8,
      veg: false,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 703,
      name: "Veg Dum Biryani",
      category: "Biryani",
      description:
        "Aromatic vegetable dum biryani prepared with basmati rice and spices.",
      price: 229,
      rating: 4.5,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 704,
      name: "Chicken Kebab",
      category: "Starters",
      description:
        "Juicy marinated chicken grilled with aromatic Indian spices.",
      price: 249,
      rating: 4.7,
      veg: false,
      image:
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=80",
    },
  ],

  Beverages: [
    {
      id: 801,
      name: "Cappuccino",
      category: "Coffee",
      description:
        "Fresh espresso topped with steamed milk and creamy milk foam.",
      price: 129,
      rating: 4.6,
      veg: true,
      bestseller: true,
      image:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 802,
      name: "Cold Coffee",
      category: "Coffee",
      description:
        "Chilled creamy coffee blended until smooth and refreshing.",
      price: 149,
      rating: 4.7,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 803,
      name: "Chocolate Milkshake",
      category: "Shakes",
      description:
        "Thick chocolate milkshake topped with chocolate sauce.",
      price: 169,
      rating: 4.6,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 804,
      name: "Veg Grilled Sandwich",
      category: "Quick Bites",
      description:
        "Grilled sandwich loaded with vegetables, cheese and flavorful sauces.",
      price: 159,
      rating: 4.4,
      veg: true,
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80",
    },
  ],
};

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const restaurant = restaurants[id];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [foodType, setFoodType] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [toast, setToast] = useState("");
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodrush-cart")) || [];
    } catch {
      return [];
    }
  });

  if (!restaurant) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">
        <div className="max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <Store size={34} className="text-orange-500" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Restaurant not found
          </h1>

          <p className="mt-3 leading-7 text-gray-500">
            The restaurant you're looking for doesn't exist or may have been
            removed.
          </p>

          <Link
            to="/restaurants"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <ArrowLeft size={18} />
            Back to Restaurants
          </Link>
        </div>
      </section>
    );
  }

  const restaurantMenu = menuData[restaurant.cuisine] || menuData.Burgers;

  const categories = [
    "All",
    ...new Set(restaurantMenu.map((item) => item.category)),
  ];

  const filteredMenu = useMemo(() => {
    return restaurantMenu.filter((food) => {
      const matchesSearch = food.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || food.category === category;

      const matchesFoodType =
        foodType === "All" ||
        (foodType === "Veg" && food.veg) ||
        (foodType === "Non-Veg" && !food.veg);

      return matchesSearch && matchesCategory && matchesFoodType;
    });
  }, [restaurantMenu, search, category, foodType]);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2200);
  };

  const saveCart = (newCart) => {
    setCart(newCart);

    localStorage.setItem(
      "foodrush-cart",
      JSON.stringify(newCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const addToCart = (food) => {
    if (restaurant.status === "Closed") {
      showToast("This restaurant is currently closed.");
      return;
    }

    const existingItem = cart.find(
      (item) =>
        item.id === food.id &&
        item.restaurantId === restaurant.id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === food.id &&
        item.restaurantId === restaurant.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...food,
          quantity: 1,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
        },
      ];
    }

    saveCart(updatedCart);

    showToast(`${food.name} added to cart`);
  };

  const increaseQuantity = (food) => {
    const existingItem = cart.find(
      (item) =>
        item.id === food.id &&
        item.restaurantId === restaurant.id
    );

    if (!existingItem) {
      addToCart(food);
      return;
    }

    const updatedCart = cart.map((item) =>
      item.id === food.id &&
      item.restaurantId === restaurant.id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (food) => {
    const existingItem = cart.find(
      (item) =>
        item.id === food.id &&
        item.restaurantId === restaurant.id
    );

    if (!existingItem) return;

    let updatedCart;

    if (existingItem.quantity === 1) {
      updatedCart = cart.filter(
        (item) =>
          !(
            item.id === food.id &&
            item.restaurantId === restaurant.id
          )
      );
    } else {
      updatedCart = cart.map((item) =>
        item.id === food.id &&
        item.restaurantId === restaurant.id
          ? {
              ...item,
              quantity: item.quantity - 1,
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
          item.restaurantId === restaurant.id
      )?.quantity || 0
    );
  };

  const toggleFavorite = (foodId) => {
    setFavorites((current) =>
      current.includes(foodId)
        ? current.filter((id) => id !== foodId)
        : [...current, foodId]
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
            <X size={17} className="text-gray-400" />
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="relative">

        <div className="relative h-82.5 overflow-hidden sm:h-100 lg:h-115">

          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/20" />

          <div className="absolute left-0 right-0 top-0">
            <div className="mx-auto max-w-7xl px-6 pt-7 lg:px-8">

              <button
                onClick={() => navigate("/restaurants")}
                className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-gray-800 shadow backdrop-blur transition hover:bg-white"
              >
                <ArrowLeft size={18} />
                Restaurants
              </button>

            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0">

            <div className="mx-auto max-w-7xl px-6 pb-8 text-white lg:px-8">

              <div className="mb-4 flex flex-wrap gap-2">

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    restaurant.status === "Open"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {restaurant.status}
                </span>

                <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur">
                  {restaurant.cuisine}
                </span>

              </div>

              <h1 className="text-3xl font-extrabold sm:text-5xl">
                {restaurant.name}
              </h1>

              <p className="mt-3 text-sm text-gray-200 sm:text-base">
                {restaurant.cuisines}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">

                <div className="flex items-center gap-2">
                  <Star
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                  <strong>{restaurant.rating}</strong>
                  <span className="text-gray-300">
                    ({restaurant.reviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  {restaurant.deliveryTime}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  {restaurant.distance}
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* RESTAURANT INFORMATION */}
      <section className="border-b bg-white">

        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_auto] lg:px-8">

          <div>

            <p className="max-w-3xl leading-7 text-gray-600">
              {restaurant.description}
            </p>

            <div className="mt-5 flex items-start gap-2 text-sm text-gray-500">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-orange-500"
              />
              {restaurant.address}
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            <div className="rounded-2xl bg-orange-50 px-5 py-4">
              <p className="text-xs text-gray-500">
                Delivery
              </p>

              <p className="mt-1 font-bold">
                {restaurant.deliveryTime}
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 px-5 py-4">
              <p className="text-xs text-gray-500">
                Cost for two
              </p>

              <p className="mt-1 font-bold">
                ₹{restaurant.priceForTwo}
              </p>
            </div>

            <div className="col-span-2 rounded-2xl bg-green-50 px-5 py-4 sm:col-span-1">
              <p className="text-xs text-gray-500">
                Offer
              </p>

              <p className="mt-1 text-sm font-bold text-green-700">
                {restaurant.offer}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* MENU */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          <div>

            {/* MENU HEADER */}
            <div className="mb-8">

              <p className="font-semibold text-orange-500">
                Restaurant Menu
              </p>

              <h2 className="mt-1 text-3xl font-bold text-gray-900">
                Choose your meal
              </h2>

              <p className="mt-2 text-gray-500">
                Freshly prepared dishes from {restaurant.name}.
              </p>

            </div>

            {/* SEARCH */}
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm focus-within:border-orange-400">

              <Search
                size={21}
                className="text-gray-400"
              />

              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none"
              />

              {search && (
                <button onClick={() => setSearch("")}>
                  <X
                    size={18}
                    className="text-gray-400"
                  />
                </button>
              )}

            </div>

            {/* VEG FILTERS */}
            <div className="mb-6 flex flex-wrap gap-3">

              {["All", "Veg", "Non-Veg"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFoodType(type)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                    foodType === type
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"
                  }`}
                >
                  {type}
                </button>
              ))}

            </div>

            {/* CATEGORY CHIPS */}
            <div className="mb-8 flex gap-3 overflow-x-auto pb-2">

              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                    category === item
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>
              ))}

            </div>

            {/* FOOD GRID */}
            {filteredMenu.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">

                {filteredMenu.map((food) => {
                  const quantity = getQuantity(food);
                  const isFavorite = favorites.includes(food.id);

                  return (
                    <div
                      key={food.id}
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
                            toggleFavorite(food.id)
                          }
                          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105"
                        >
                          <Heart
                            size={19}
                            className={
                              isFavorite
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

                      {/* INFO */}
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

                        <h3 className="mt-4 text-xl font-bold text-gray-900">
                          {food.name}
                        </h3>

                        <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                          {food.description}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-4">

                          <p className="text-xl font-extrabold text-gray-900">
                            ₹{food.price}
                          </p>

                          {quantity === 0 ? (
                            <button
                              disabled={
                                restaurant.status === "Closed"
                              }
                              onClick={() => addToCart(food)}
                              className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                                restaurant.status === "Open"
                                  ? "bg-orange-500 text-white hover:bg-orange-600"
                                  : "cursor-not-allowed bg-gray-200 text-gray-400"
                              }`}
                            >
                              Add to Cart
                            </button>
                          ) : (
                            <div className="flex items-center overflow-hidden rounded-xl border border-orange-200 bg-orange-50">

                              <button
                                onClick={() =>
                                  decreaseQuantity(food)
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
                                  increaseQuantity(food)
                                }
                                className="p-2.5 text-orange-600 transition hover:bg-orange-100"
                              >
                                <Plus size={17} />
                              </button>

                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            ) : (
              <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                  <Search
                    size={27}
                    className="text-orange-500"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  No dishes found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try another search or category.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                    setFoodType("All");
                  }}
                  className="mt-5 rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white"
                >
                  Reset Filters
                </button>

              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">

            {/* OFFER */}
            <div className="rounded-3xl bg-orange-500 p-6 text-white shadow-lg">

              <p className="text-sm font-semibold text-orange-100">
                EXCLUSIVE OFFER
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {restaurant.offer}
              </h3>

              <p className="mt-3 text-sm leading-6 text-orange-100">
                Apply automatically when your order meets the offer conditions.
              </p>

            </div>

            {/* DELIVERY INFO */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <h3 className="font-bold text-gray-900">
                Delivery Information
              </h3>

              <div className="mt-5 space-y-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                    <Bike
                      size={19}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Delivery Time
                    </p>

                    <p className="text-sm font-semibold">
                      {restaurant.deliveryTime}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                    <MapPin
                      size={19}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Distance
                    </p>

                    <p className="text-sm font-semibold">
                      {restaurant.distance}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                    <IndianRupee
                      size={19}
                      className="text-orange-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Cost for two
                    </p>

                    <p className="text-sm font-semibold">
                      ₹{restaurant.priceForTwo}
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* CLOSED MESSAGE */}
            {restaurant.status === "Closed" && (
              <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
                <Info
                  size={20}
                  className="shrink-0"
                />

                <p>
                  This restaurant is currently closed. You can browse the menu,
                  but ordering is temporarily unavailable.
                </p>
              </div>
            )}

            {/* CART PREVIEW */}
            {cartCount > 0 && (
              <div className="rounded-3xl bg-zinc-900 p-6 text-white shadow-xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                    <ShoppingBag size={21} />
                  </div>

                  <div>
                    <p className="font-bold">
                      Your Cart
                    </p>

                    <p className="text-sm text-gray-400">
                      {cartCount} {cartCount === 1 ? "item" : "items"}
                    </p>
                  </div>

                </div>

                <div className="my-5 border-t border-zinc-700" />

                <div className="flex justify-between">

                  <span className="text-gray-400">
                    Current total
                  </span>

                  <span className="text-lg font-bold">
                    ₹{cartTotal}
                  </span>

                </div>

                <button
                  onClick={() => navigate("/cart")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-bold transition hover:bg-orange-600"
                >
                  View Cart
                  <ChevronRight size={18} />
                </button>

              </div>
            )}

          </aside>

        </div>
      </section>

    </div>
  );
}

export default RestaurantDetails;