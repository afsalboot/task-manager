import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AppContext } from "../context/AppContext.jsx";
import Loading from "../components/Loading.jsx";

const Signup = () => {
  const { signup, setHideSignupButton } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setHideSignupButton(true);
    return () => setHideSignupButton(false);
  }, [setHideSignupButton]);

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

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await signup(values);
      setSubmitting(false);
      if (res !== false) navigate("/login");
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300 px-4">
      <div className="w-full max-w-md sm:max-w-lg rounded-2xl p-6 sm:p-8 transition-all duration-300">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-[#4B0082] dark:text-[#A694F7] mb-6">
          Create Account
        </h2>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm sm:text-base text-light-text dark:text-dark-text"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`w-full px-4 py-2 rounded-lg border bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#A694F7] ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm sm:text-base text-light-text dark:text-dark-text"
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
              className={`w-full px-4 py-2 rounded-lg border bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#A694F7] ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm sm:text-base text-light-text dark:text-dark-text"
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
              className={`w-full px-4 py-2 rounded-lg border bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#A694F7] ${
                formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-4 w-full flex justify-center py-2 font-medium text-lg rounded-lg text-dark-text dark:text-light-text bg-[#4B0082] dark:bg-[#A694F7] hover:bg-[#C1A6D1] transition"
          >
            {formik.isSubmitting ? (
              <Loading size={12} color="text-white" />
            ) : (
              "Signup"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-100 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#A694F7] hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
