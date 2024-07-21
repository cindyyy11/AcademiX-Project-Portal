import SettingsPage from "./SettingNested/index";
import Providers from "../../../pages/Auth/Provider";

import React from "react";

function index() {
  return (
    <Providers>
      <SettingsPage />
    </Providers>
  );
}

export default index;
