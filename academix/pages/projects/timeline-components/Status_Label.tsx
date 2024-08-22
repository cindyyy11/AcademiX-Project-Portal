import React from "react";
import statusStyles from "../../../styles/Status_Badge.module.css";

// Define status options as readonly
const statusOptions = {
  "no submission": "NO_SUBMISSION",
  "pending review": "PENDING_REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
} as const;


// Create a type for the keys of statusOptions
type StatusOption = keyof typeof statusOptions;

// Function to get the corresponding CSS class based on status
const getStatusClassName = (status: StatusOption): string => {
  switch (status) {
    case "pending review":
      return statusStyles.statusPendingReview;
    case "approved":
      return statusStyles.statusApproved;
    case "rejected":
      return statusStyles.statusRejected;
    default:
      return statusStyles.statusNoSubmission;
  }
};

// Props interface for StatusLabel component
interface StatusLabelProps {
  status: StatusOption;
}

// StatusLabel component
const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
  return (
    <div className={`dui-status-badge ${getStatusClassName(status)}`}>
      {statusOptions[status]} {/* Display the status text */}
      
    </div>
  );
};

export { StatusLabel, statusOptions };
