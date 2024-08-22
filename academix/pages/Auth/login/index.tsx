// LoginIndex.tsx
import React from "react";
import Providers from "../Provider";
import Login from "./LoginBase/Login";

const LoginPage = () => {
  return (
    <Providers>
      <Login />
    </Providers>
  );
};

export default LoginPage;
