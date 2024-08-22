import Providers from "../Provider";
import Signup from "./signupBase/SignUp";

import React from "react";

const SignupPage = () => {
  return (
    <>
      <Providers>
        <Signup />
      </Providers>
    </>
  );
}

export default SignupPage;
