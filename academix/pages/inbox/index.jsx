import Layout from "@/components/Layout";
import Inbox from "@/components/Inbox";
import Providers from "pages/Auth/Provider";

const Main = () => {
  return (
    <Layout>
      <Providers>
        <Inbox />
      </Providers>
    </Layout>
  );
};

export default Main;
