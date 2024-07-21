import { useState } from "react";
import Layout from "@/components/Layout";
import Profile from "@/components/Profile/Index";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import AccountPage from "../Account";
import Security from "../Security";
import SocialNetworks from "../SocialNetworks";
import Notifications from "../Notifications";
import Link from "next/link";
import { useLoadUserQuery } from "../../../../redux/features/api/apiSlice";


const SettingsPage = () => {
  const [type, setType] = useState<string>("account");
  const { data: userData, isLoading, isError } = useLoadUserQuery();

  const types = [
    {
      title: "Account",
      value: "account",
    },
    {
      title: "Security",
      value: "security",
    },
    {
      title: "Social Networks",
      value: "social-networks",
    },
    {
      title: "Notifications",
      value: "notifications",
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>; // Replace with LoadingSpinner if you have one
  }

  if (isError || !userData) {
    return <div>Error loading user data</div>;
  }

  const user = {
    name: userData.user.name,
    email: userData.user.email,
    role: userData.user.role,
    avatarUrl: userData.user.avatar?.url,
  };

  return (
    <Layout title="Profile Settings">
      <div className="flex pt-4 lg:block">
        <div className="shrink-0 w-[20rem] 4xl:w-[14.7rem] lg:w-full lg:mb-8">
          <Profile
            user={{
              name: "",
              email: "",
              role: "",
              avatarUrl: "",
            }}
          />
        </div>
        <div className="w-[calc(100%-20rem)] pl-[6.625rem] 4xl:w-[calc(100%-14.7rem)] 2xl:pl-10 lg:w-full lg:pl-0">
          <div className="flex justify-between mb-6 md:overflow-auto md:-mx-5 md:scrollbar-none md:before:w-5 md:before:shrink-0 md:after:w-5 md:after:shrink-0">
            <Tabs
              className="2xl:ml-0 md:flex-nowrap"
              classButton="2xl:ml-0 md:whitespace-nowrap"
              items={types}
              value={type}
              setValue={setType}
            />
            <button className="btn-stroke btn-small shrink-0 min-w-[6rem] ml-4 md:hidden">
              <Icon name="dots" />
              <Link href="/crm/contacts-v2">
                <span>Contacts</span>
              </Link>
            </button>
          </div>
          {type === "account" && <AccountPage />}
          {type === "security" && <Security />}
          {type === "social-networks" && <SocialNetworks />}
          {type === "notifications" && <Notifications />}
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
