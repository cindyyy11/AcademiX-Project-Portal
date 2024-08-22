import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Menu from "./Menu";
import TeamMembers from "./TeamMembers";
import axios from "axios";
import { useLoadUserQuery } from "../../../redux/features/api/apiSlice";

type SidebarProps = {};

const SidebarRaw = ({}: SidebarProps) => {
  const { data: userData } = useLoadUserQuery({});
  const [visible, setVisible] = useState<boolean>(false);

  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/logout");
      window.location.href = "http://localhost:3002/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 flex flex-col w-[18.75rem] pt-6 px-8 pb-4.5 bg-n-1 overflow-auto scroll-smooth xl:z-30 md:hidden ${
        visible ? "w-[18.75rem]" : "xl:w-20"
      }`}
    >
      <div className="flex justify-between items-center h-[1.625rem] mb-11">
        <Logo className={visible ? "flex" : "xl:hidden"} light />
        <button className="hidden xl:flex" onClick={() => setVisible(!visible)}>
          <Icon className="fill-white" name={visible ? "close" : "burger"} />
        </button>
      </div>
      <Menu visible={visible} />
      {/* <TeamMembers visible={visible} /> */}
      <div
        className={`flex items-center h-18 mt-auto mx-0 pt-10 ${
          visible ? "mx-0" : "xl:-mx-4"
        }`}
      >
        <Link
          className={`inline-flex items-center font-bold text-white text-sm transition-colors hover:text-purple-1 ${
            visible ? "mx-0 text-sm" : "xl:mx-auto xl:text-0"
          }`}
          href="/profile/settings"
        >
          <div
            className={`relative w-5.5 h-5.5 mr-2.5 rounded-full overflow-hidden ${
              visible ? "mr-2.5" : "xl:mr-0"
            }`}
          >
            <Image
              className="object-cover scale-105"
              src="/assets/unknownUser.jpg"
              fill
              alt="Avatar"
            />
          </div>
          {userData?.user?.name || "N/A"}
        </Link>
        <div className="flex justify-end items-end">
          <a href="http://localhost:3002/" onClick={handleLogout}>
            <button
              className={`btn-transparent-light btn-square btn-small ml-auto`}
            >
              <svg
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 52 52"
              >
                <g>
                  <path
                    d="M21,48.5v-3c0-0.8-0.7-1.5-1.5-1.5h-10C8.7,44,8,43.3,8,42.5v-33C8,8.7,8.7,8,9.5,8h10
      C20.3,8,21,7.3,21,6.5v-3C21,2.7,20.3,2,19.5,2H6C3.8,2,2,3.8,2,6v40c0,2.2,1.8,4,4,4h13.5C20.3,50,21,49.3,21,48.5z"
                  />
                  <path
                    d="M49.6,27c0.6-0.6,0.6-1.5,0-2.1L36.1,11.4c-0.6-0.6-1.5-0.6-2.1,0l-2.1,2.1c-0.6,0.6-0.6,1.5,0,2.1l5.6,5.6
      c0.6,0.6,0.2,1.7-0.7,1.7H15.5c-0.8,0-1.5,0.6-1.5,1.4v3c0,0.8,0.7,1.6,1.5,1.6h21.2c0.9,0,1.3,1.1,0.7,1.7l-5.6,5.6
      c-0.6,0.6-0.6,1.5,0,2.1l2.1,2.1c0.6,0.6,1.5,0.6,2.1,0L49.6,27z"
                  />
                </g>
              </svg>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SidebarRaw;
