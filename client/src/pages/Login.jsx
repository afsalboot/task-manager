import React, { useContext, useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate, Link } from "react-router";
import Loading from "../components/Loading.jsx";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must contain 8 characters")
    .required("Password is required"),
});

const Login = () => {
  const { login, setHideSignupButton } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setHideSignupButton(true);
    return () => setHideSignupButton(false);
  }, []);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const success = await login(values);
      if (success) navigate("/");
      else setErrors({ email: "Invalid credentials" });
    } catch (err) {
      console.error(err.message);
      setErrors({ email: "Something went wrong" });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300 px-4">
      <div className="w-full max-w-md sm:max-w-lg bg-light-bg-form dark:bg-dark-bg-form rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-light-text-dull dark:text-dark-text mb-6">
          Login
        </h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" autoComplete="off">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base font-medium text-light-text-dull dark:text-dark-text mb-1"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  autoComplete="off"
                  className="w-full px-3 py-2 border rounded-md bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm sm:text-base font-medium text-light-text-dull dark:text-dark-text mb-1"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  className="w-full px-3 py-2 border rounded-md bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 bg-light-primary dark:bg-dark-button text-light-text-dull dark:text-dark-text hover:bg-hover-light dark:hover:bg-hover-dark font-semibold rounded-md transition-colors duration-300"
              >
                {isSubmitting ? (
                  <Loading size={12} color="text-white" />
                ) : (
                  "Login"
                )}
              </button>

              <p className="text-center text-sm sm:text-base text-gray-600 dark:text-dark-text mt-4">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
