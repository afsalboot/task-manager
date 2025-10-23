import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const { signup, setHideSignupButton  } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setHideSignupButton(true);
    return () => setHideSignupButton(false)
  },[setHideSignupButton])

  //Yup schema for validation
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(5, "Name must contain at least 5 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must contain at least 8 characters")
      .required("Password is required"),
  });

  //Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await signup(values);
      setSubmitting(false);
      if (res !== false) navigate("/login");
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-light-bg-form dark:bg-dark-bg-form transition-all duration-300">
        {/* Header */}
        <h2 className="text-3xl font-semibold text-center mb-6 text-light-text-dull dark:text-dark-text">
          Create Account
        </h2>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Name field */}
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm text-light-text-dull dark:text-dark-text"
            >
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`w-full px-4 py-2 rounded-lg bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull border ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>
          {/* Email Field */}
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm text-light-text-dull dark:text-dark-text"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full px-4 py-2 rounded-lg bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull border ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-light-text-dull dark:text-dark-text"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`w-full px-4 py-2 rounded-lg bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull border ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={formik.isSubmitting} className="mt-4 w-50 py-2 self-center font-medium text-lg rounded-lg bg-light-primary dark:bg-dark-button text-light-text-dull dark:text-dark-text hover:bg-hover-light dark:hover:bg-hover-dark transition">{formik.isSubmitting ? "Signing up..." : "Signup"}</button>
        </form>
        {/* Footer Links */}
        <p className="text-center text-sm text-light-text-dull dark:text-dark-text mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Log In
            </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
