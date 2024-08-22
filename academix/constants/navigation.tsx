import { icon } from "@fortawesome/fontawesome-svg-core";
import { useLoadUserQuery } from "../redux/features/api/apiSlice";
import { url } from "inspector";

export const navigation = (role: string) => {
  switch (role) {
    case "admin":
      return [
        {
          title: "Dashboard",
          icon: "dashboard",
          counter: 16,
          url: "/dashboard/Admin/projects",
        },
        {
          title: "Projects",
          icon: "projects",
          url: "/projects/Admin/projects-list-v2",
        },
        {
          title: "File Manager",
          icon: "file",
          counter: 14,
          counterColor: "#98E9AB",
          url: "/projects/Admin/file-manager-folders",
        },
        {
          title: "Calendar",
          icon: "calendar",
          url: "/projects/Admin/calendar",
        },
        {
          title: "Inbox",
          icon: "email",
          url: "/inbox",
        },
        {
          title: "Forum",
          icon: "comments",
          url: "https://academix.boards.net/",
        },
      ];
    case "supervisor":
      return [
        {
          title: "Dashboard",
          icon: "dashboard",
          counter: 16,
          url: "/dashboard/Supervisor/projects",
        },
        {
          title: "Projects",
          icon: "projects",
          url: "/projects/Supervisor/projects-list-v2",
        },
        {
          title: "File Manager",
          icon: "file",
          counter: 14,
          counterColor: "#98E9AB",
          url: "/projects/Supervisor/file-manager-folders",
        },
        {
          title: "Calendar",
          icon: "calendar",
          url: "/projects/Supervisor/calendar",
        },
        {
          title: "Inbox",
          icon: "email",
          url: "/inbox",
        },
        {
          title: "Forum",
          icon: "comments",
          url: "https://academix.boards.net/",
        },
      ];
    case "student":
      return [
        {
          title: "Dashboard",
          icon: "dashboard",
          counter: 16,
          url: "/dashboard/Student/projects",
        },
        {
          title: "Projects",
          icon: "projects",
          url: "/projects/Student/projects-list-v2",
        },
        {
          title: "File Manager",
          icon: "file",
          counter: 14,
          counterColor: "#98E9AB",
          url: "/projects/Student/file-manager-folders",
        },
        {
          title: "Calendar",
          icon: "calendar",
          url: "/projects/Student/calendar",
        },
        {
          title: "Inbox",
          icon: "email",
          url: "/inbox",
        },
        {
          title: "Forum",
          icon: "comments",
          url: "https://academix.boards.net/",
        },
      ];
    default:
      return [
        {
          title: "Dashboard",
          icon: "dashboard",
          counter: 16,
          url: "/dashboard/projects",
        },
        {
          title: "Projects",
          icon: "projects",
          url: "/projects/projects-list-v2",
        },
        {
          title: "File Manager",
          icon: "file",
          counter: 14,
          counterColor: "#98E9AB",
          url: "/projects/file-manager-folders",
        },
        {
          title: "Calendar",
          icon: "calendar",
          url: "/projects/calendar",
        },
        {
          title: "Inbox",
          icon: "email",
          url: "/inbox",
        },
        {
          title: "Forum",
          icon: "comments",
          url: "https://academix.boards.net/",
        },
      ];
  }
};

export const navigationMobile = [
  {
    icon: "dashboard",
    url: "/dashboard/ecommerce",
  },
  {
    icon: "projects",
    url: "/projects/projects-list-v1",
  },
  {
    icon: "tasks",
    url: "/projects/tasks-list-v1",
  },
  {
    icon: "layers",
    url: "/projects/kanban-desc",
  },
  {
    title: "Inbox",
    icon: "email",
    url: "/inbox",
  },
  {
    title: "Forum",
    icon: "comments",
    url: "https://academix.boards.net/",
  },

];
