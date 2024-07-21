import React, { useEffect, useState } from "react";
import { useEditProfileMutation } from "../../../../../redux/features/user/userApi";
import { useLoadUserQuery } from "../../../../../redux/features/api/apiSlice";
import { toast } from "react-hot-toast";

type AccountProps = {};

type AccountDetails = {
  id: string;
  label: string;
  value: string;
  fullWide?: boolean;
};

const getInputType = (label: string) => {
  switch (label) {
    case "Date of birth":
      return "date";
    case "Email address":
      return "email";
    case "Phone number":
      return "tel";
    case "Gender":
      return "select"; // Return "select" for Gender
    default:
      return "text";
  }
};

const Account = ({}: AccountProps) => {
  const { data: userData, refetch } = useLoadUserQuery({});
  const [accountDetails, setAccountDetails] = useState<AccountDetails[]>([]);
  const [editProfile, { isSuccess, error }] = useEditProfileMutation();

  useEffect(() => {
    if (userData) {
      setAccountDetails([
        { id: "name", label: "Name", value: userData.user.name || "N/A" },
        { id: "email", label: "Email address", value: userData.user.email || "N/A" },
        {
          id: "dob",
          label: "Date of birth",
          value: userData.user.dateOfBirth || "N/A",
        },
        {
          id: "phone",
          label: "Phone number",
          value: userData.user.phoneNumber || "N/A",
        },
        { id: "gender", label: "Gender", value: userData.user.gender || "" },
        { id: "role", label: "Role", value: userData.user.role || "N/A" },
      ]);
    }
  }, [userData]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully");
      refetch(); // Refetch user data after successful update
    }
    if (error) {
      toast.error("Failed to update profile");
    }
  }, [isSuccess, error, refetch]);

  const handleInputChange = (id: string, value: string) => {
    setAccountDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.id === id ? { ...item, value: value } : item
      )
    );
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGender = event.target.value;
    setAccountDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.id === "gender" ? { ...item, value: selectedGender } : item
      )
    );
  };

  const handleUpdateSettings = async () => {
    try {
      const updates = accountDetails.reduce((acc, item) => {
        acc[item.id] = item.value;
        return acc;
      }, {} as Record<string, string>);

      await editProfile(updates).unwrap();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="card">
      <div className="card-title">Public account details</div>
      <div className="p-5">
        <div className="flex flex-wrap -mt-4 -mx-2.5">
          {accountDetails.map((item) => (
            <div
              className={`mt-4 mx-2.5 pb-3 border-b border-n-1 dark:border-white ${
                item.fullWide
                  ? "w-[calc(100%-1.25rem)]"
                  : "w-[calc(50%-1.25rem)] md:w-[calc(100%-1.25rem)]"
              }`}
              key={item.id}
            >
              <div className="mb-1.5 text-xs text-n-3 dark:text-white/75">
                {item.label}
              </div>
              {getInputType(item.label) === "select" ? (
                <select
                  className="text-sm font-bold placeholder-text-black-400 border-0 block w-full w-90"
                  value={item.value}
                  onChange={handleGenderChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  className="text-sm font-bold placeholder-text-black-400 border-0 block w-full w-90"
                  placeholder={item.value === "" ? "N/A" : item.value}
                  type={getInputType(item.label)}
                  value={item.value}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-16 md:block md:mt-8">
          <button className="btn-stroke min-w-[11.7rem] md:w-full md:mb-3 hover:bg-red-600 hover:border-red-600">
            Delete Account Forever
          </button>
          <button
            className="btn-purple min-w-[11.7rem] md:w-full"
            onClick={handleUpdateSettings}
          >
            Update Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
