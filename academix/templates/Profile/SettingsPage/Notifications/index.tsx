import { useState } from "react";
import Switch from "@/components/Switch";

type NotificationsProps = {};

const Notifications = ({}: NotificationsProps) => {
    const [notifications, setNotifications] = useState([
        {
            id: "0",
            label: "Project Updates",
            title: "Receive updates about your project milestones and progress.",
            isChecked: true,
        },
        {
            id: "1",
            label: "Submission Deadlines",
            title: "Get notified about upcoming submission deadlines.",
            isChecked: false,
        },
        {
            id: "2",
            label: "Meeting Reminders",
            title: "Receive reminders for scheduled meetings with your supervisor.",
            isChecked: true,
        },
        {
            id: "3",
            label: "Feedback and Reviews",
            title: "Receive feedback and review notifications from your supervisor.",
            isChecked: true,
        },
        {
            id: "4",
            label: "General Announcements",
            title: "Get general announcements and updates from the project management system.",
            isChecked: false,
        },
    ]);

    const handleNotificationChange = (notificationId: string) => {
        const updatedNotifications = [...notifications];
        const notificationIndex = updatedNotifications.findIndex(
            (notification) => notification.id === notificationId
        );
        updatedNotifications[notificationIndex].isChecked =
            !updatedNotifications[notificationIndex].isChecked;
        setNotifications(updatedNotifications);
    };

    return (
        <div className="card">
            <div className="card-title">Notifications</div>
            <div className="p-5">
                <div>
                    {notifications.map((notification) => (
                        <div
                            className="flex items-end mb-4 pb-4 border-b border-n-1 dark:border-white"
                            key={notification.id}
                        >
                            <div className="mr-auto">
                                <div className="mb-1.5 text-xs text-n-3 dark:text-white/75">
                                    {notification.label}
                                </div>
                                <div className="text-sm font-bold">
                                    {notification.title}
                                </div>
                            </div>
                            <Switch
                                value={notification.isChecked}
                                setValue={() =>
                                    handleNotificationChange(notification.id)
                                }
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-16 md:block md:mt-8">
                    <button className="btn-stroke min-w-[11.7rem] md:w-full md:mb-3">
                        Reset Changes
                    </button>
                    <button className="btn-purple min-w-[11.7rem] md:w-full">
                        Update Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
