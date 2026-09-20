/* eslint-disable @next/next/no-img-element */
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { enterDemoMode } from "../../../../redux/features/api/apiSlice";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const Login: FC = () => {
  const [show, setShow] = useState(false);
  const [login, { error }] = useLoginMutation();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      try {
        await login({ email, password }).unwrap();;
        console.log("Login successful!");
        toast.success("Login successful!")
        alert("Login successful!")
        router.push("/dashboard/projects");
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed. Please check your credentials.");
        alert("Login failed. Please check your credentials.")
      }
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
      alert("Login failed. Please check your credentials.")
    }
  }, [error]);

  const { handleSubmit, handleChange, values, errors, touched } = formik;

  const handleDemoLogin = () => {
    enterDemoMode();
    toast.success("Signed in with the demo account!");
    router.push("/dashboard/Student/projects");
  };

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-white px-6 py-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <img
            className="mx-auto h-14 w-auto"
            src="/inboxImage/AcademiXProjectPortal-icon.png"
            alt="AcademiX Project Portal"
          />
          <h2 className="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium leading-6 text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              id="email"
              placeholder="loginmail@gmail.com"
              className={`${
                errors.email && touched.email
                  ? "!border-red-500 focus:!ring-red-500"
                  : ""
              } mt-1 w-full h-10 px-3 rounded border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600`}
            />
            {errors.email && touched.email && (
              <span className="mt-1 block text-sm text-red-500">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium leading-6 text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={!show ? "password" : "text"}
                name="password"
                value={values.password}
                onChange={handleChange}
                id="password"
                placeholder="Enter your password"
                className={`${
                  errors.password && touched.password
                    ? "!border-red-500 focus:!ring-red-500"
                    : ""
                } pr-10 w-full h-10 px-3 rounded border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600`}
              />
              <button
                type="button"
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <span className="mt-1 block text-sm text-red-500">
                {errors.password}
              </span>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <input
              type="submit"
              value="Login"
              className="flex w-full cursor-pointer justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex w-full justify-center rounded-md border border-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-indigo-600 hover:bg-indigo-50"
            >
              Continue with Demo Account
            </button>
          </div>

          <p className="pt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/Auth/signup"
              className="font-semibold text-[#2190ff] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
