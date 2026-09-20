// Notifications are not stored anywhere. They are worked out from activity that
// already exists: new messages in your chats and new replies to your forum
// threads, both from other people. Whether one has been read is kept in the
// browser (see useNotifications).

export type AppNotification = {
  id: string;
  kind: "message" | "reply";
  title: string;
  text: string;
  createdAt: string;
  url: string;
};

// Only activity this recent is listed.
export const WINDOW_DAYS = 14;
export const MAX_NOTIFICATIONS = 30;
export const TEXT_LENGTH = 120;

export const messageTitle = (senderName: string, chat: { isGroup: boolean; name?: string | null }) =>
  chat.isGroup ? `${senderName} in ${chat.name || "a group chat"}` : senderName;

export const replyTitle = (authorName: string, threadTitle: string) => `${authorName} replied to "${threadTitle}"`;

export const latestFirst = (items: AppNotification[]) =>
  [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, MAX_NOTIFICATIONS);
