import React from "react";
import { useLoadUserQuery } from "../../redux/features/api/apiSlice";
import Profile from "@/components/Profile/Index";
import LoadingSpinner from "@/components/LoadingSpinner";

const ProfilePage = () => {
  const { data: userData, isLoading, isError } = useLoadUserQuery({}); // Pass an empty object as an argument

  if (isLoading) {
    return <LoadingSpinner />;
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
    <div className="container mx-auto p-4">
      <Profile user={user} actions />
    </div>
  );
};

export default ProfilePage;
