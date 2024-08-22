import LoginBase from "./loginBase";
import Providers from "pages/Auth/Provider";


const Login: React.FC = () => {

  return (
    <Providers>
      <LoginBase />
    </Providers>
  );
};

export default Login;
