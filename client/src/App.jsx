import React from "react";
import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import TaskForm from "./pages/TaskForm.jsx";
import Profile from "./pages/Profile.jsx";
import AuthRoute from "./components/AuthRoute.jsx";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Dashboard />} />
          <Route
            path="login"
            element={
              <AuthRoute protect={false}>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="signup"
            element={
              <AuthRoute protect={false}>
                <Signup />
              </AuthRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="add-task"
            element={
              <AuthRoute protect={true}>
                <TaskForm />
              </AuthRoute>
            }
          />
          <Route
            path="profile"
            element={
              <AuthRoute protect={true}>
                <Profile />
              </AuthRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
