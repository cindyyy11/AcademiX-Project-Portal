import React from 'react'
import App from './Frontend/src/App.jsx'
import styles from "./Frontend/src/App.module.css";
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
