import Providers from "pages/Auth/Provider";
import SidebarRaw from "./SidebarRaw";

type SidebarProps = {};

const Sidebar = ({}: SidebarProps) => {
  return (
    <Providers>
      <SidebarRaw />
    </Providers>
  );
};

export default Sidebar;
