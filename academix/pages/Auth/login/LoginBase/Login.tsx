/* eslint-disable @next/next/no-img-element */
import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginMutation } from "../../../../redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter``` your password!").min(6),
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

  return (
    <div className="flex w-full justify-center py-3 bg-white pt-15">
      <div className="flex min-h-full max-w-lg flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="/inboxImage/AcademiXProjectPortal-icon.png"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium leading-6 text-gray-900"
                htmlFor="email"
              >
                Enter your Email
              </label>

              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  id="email"
                  placeholder="loginmail@gmail.com"
                  className={`${
                    errors.email && touched.email && "border-red-500"
                  } w-full text-black dark:text-white bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins`}
                />
                {errors.email && touched.email && (
                  <span className="text-red-500 pt-2 block">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium leading-6 text-gray-900"
                htmlFor="password"
              >
                Enter your Password
              </label>
              <div className="mt-2 static">
                <div>
                  <input
                    type={!show ? "password" : "text"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    id="password"
                    placeholder="password!@%"
                    className={`${
                      errors.password && touched.password && "border-red-500"
                    } w-full text-black dark:text-white bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins`}
                  />
                  <div className="relative">
                    {!show ? (
                      <AiOutlineEyeInvisible
                        className="absolute bottom-3 right-2 z-1 cursor-pointer"
                        size={20}
                        onClick={() => setShow(true)}
                      />
                    ) : (
                      <AiOutlineEye
                        className="absolute bottom-3 right-2 z-1 cursor-pointer"
                        size={20}
                        onClick={() => setShow(false)}
                      />
                    )}
                    {errors.password && touched.password && (
                      <span className="text-red-500 pt-2 block">
                        {errors.password}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-5">
              <input
                type="submit"
                value="Login"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
            <br />
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
              Or join with
            </h5>
            <div className="flex items-center justify-center my-3">
              {/* Social login icons */}
            </div>
            <h5 className="text-center pt-4 font-Poppins text-[14px]">
              Dont have an account?{" "}
              <span
                className="text-[#2190ff] pl-1 cursor-pointer"
                onClick={() => router.push("/Auth/signup")}
              >
                Sign up
              </span>
            </h5>
          </form>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Login;
