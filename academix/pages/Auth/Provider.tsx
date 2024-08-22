import React from "react";
import { Provider } from "react-redux";
import { store } from "../../redux/features/store";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;