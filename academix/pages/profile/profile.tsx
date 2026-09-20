import React from "react";
import { useCurrentUser } from "../../redux/features/api/apiSlice";
import Profile from "@/components/Profile/Index";
import LoadingSpinner from "@/components/LoadingSpinner";
import Providers from "../Auth/Provider";

const ProfileContent = () => {
  const { data: userData, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !userData) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Profile actions />
    </div>
  );
};

const ProfilePage = () => (
  <Providers>
    <ProfileContent />
  </Providers>
);

export default ProfilePage;
