import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";

function App() {
  return (
    <Routes>
      {/* =========================================
          PAGES WITH NAVBAR + FOOTER
      ========================================= */}

      <Route element={<Layout />}>
        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* RESTAURANTS */}
        <Route
          path="/restaurants"
          element={<Restaurants />}
        />

        <Route
          path="/restaurants/:id"
          element={<RestaurantDetails />}
        />

        {/* GLOBAL MENU */}
        <Route
          path="/menu"
          element={<Menu />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* ORDER CONFIRMATION */}
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* ORDER HISTORY */}
        <Route
          path="/orders"
          element={<Orders />}
        />

        {/* ORDER TRACKING */}
        <Route
          path="/track-order/:id"
          element={<OrderTracking />}
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
      </Route>
    </Routes>
  );
}

export default App;