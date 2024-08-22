import React from "react";
import App from "./App";
import styles from "./App.module.css";
import Layout from "@/components/Layout";

const Main = () => {
  return (
    <Layout>
      <div className={styles.chatBody}>
        <App />
      </div>
    </Layout>
  );
};

export default Main;
