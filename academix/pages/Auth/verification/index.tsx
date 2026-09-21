import Providers from "../Provider";
import Verification from "@/components/Auth/Verification";

import React from "react";

const VerificationPage = () => {
  return (
    <>
      <Providers>
        <Verification />
      </Providers>
    </>
  );
}

export default VerificationPage;
