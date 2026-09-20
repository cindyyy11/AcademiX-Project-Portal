import Layout from "@/components/Layout";
import Forum from "@/components/Forum";
import Providers from "pages/Auth/Provider";

const Main = () => {
  return (
    <Layout>
      <Providers>
        <Forum />
      </Providers>
    </Layout>
  );
};

export default Main;
