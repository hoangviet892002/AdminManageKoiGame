import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import { Dashboard, Login, Register } from "../pages";
import { Screen404, Screen500, Screen501 } from "../pages/errors";
import KoiTypes from "../pages/KoiTypes";
import GameItems from "../pages/GameItems";
import Templates from "../pages/Templates";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PrivateRoute isAuthPage>
              <Login />
            </PrivateRoute>
          }
        />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <div>Profile Page</div>
            </PrivateRoute>
          }
        />
        <Route
          path="/koi-types"
          element={
            <PrivateRoute>
              <KoiTypes />
            </PrivateRoute>
          }
        />
        <Route
          path="/game-items"
          element={
            <PrivateRoute>
              <GameItems />
            </PrivateRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <PrivateRoute>
              <Templates />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/501" element={<Screen501 />} />
      <Route path="/500" element={<Screen500 />} />
      <Route path="*" element={<Screen404 />} />
    </Routes>
  );
};

export default AppRoutes;
