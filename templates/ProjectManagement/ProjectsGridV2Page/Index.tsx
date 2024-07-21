import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Tabs from "@/components/Tabs";
import Icon from "@/components/Icon";
import Item from "./Item/Index";
import Link from "next/link";
import { useRouter } from "next/router";

// import { projects4 } from "@/mocks/projects";

type ProjectDetails = {
  title: string;
  logo: string;
  about: string;
  objective: string;
  categories: string;
  taskDone: number;
  tasksAll: number;
  handOutDate: string | null;
  dueDate: string | null;
  users: string[];
  _id: string;
};

const ProjectsGridV2Page = () => {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails[]>([]); // State changed to array

  // Fetch all project details from the backend
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/get-all-projects"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched projects:", data);

        // Assuming data.projects is an array of project details
        const projects = data.projects.map((project: any) => ({
          title: project.title || "",
          logo: project.logo || "",
          about: project.about || "",
          objective: project.objective || "",
          categories: project.categories || "",
          taskDone: project.taskDone || 0,
          tasksAll: project.tasksAll || 0,
          handOutDate: project.handOutDate
            ? project.handOutDate.toString().split("T")[0]
            : null,
          dueDate: project.dueDate
            ? project.dueDate.toString().split("T")[0]
            : null,
          users: project.users || [],
          _id: project._id || "",
        }));

        setProjectDetails(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    }

    fetchProjects();
  }, []);

  const [type, setType] = useState<string>("all-projects");


  const router = useRouter();
  const { pathname } = router;

  const getUserRoleFromPath = () => {
    const pathSegments = pathname.split("/");
    const roleIndex = pathSegments.indexOf("projects") + 1;
    return pathSegments[roleIndex];
  };

  const userRole = getUserRoleFromPath();

  const getViewLink = () => {
    switch (userRole) {
      case "Student":
        return `/projects/Student/projects-list-v2`;
      case "Supervisor":
        return `/projects/Supervisor/projects-list-v2`;
      case "Admin":
        return `/projects/Admin/projects-list-v2`;
      default:
        return "#";
    }
  };

  const types = [
    {
      title: "All Projects",
      value: "all-projects",
    },
    {
      title: "Pending",
      value: "pending",
    },
    {
      title: "Done",
      value: "done",
    },
    {
      title: "Archieved",
      value: "archieved",
    },
  ];

  return (
    <Layout title="All Projects">
      <div className="flex mb-6 md:block md:mb-5">
        {/* <Tabs
          className="mr-auto md:ml-0"
          classButton="md:ml-0 md:grow md:px-2"
          items={types}
          value={type}
          setValue={setType}
        /> */}
        {/* <button className="btn-stroke btn-small mr-1.5 md:hidden">
          <Icon name="filters" />
          <span>Sort: A-Z</span>
        </button> */}
        <Link href={getViewLink()}>
          <button className="btn-stroke btn-small md:hidden">
            <Icon name="dots" />
            <span>List View</span>
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap -mt-5 -mx-2.5 md:-mt-2.5">
        {projectDetails.map((project) => (
          <Item key={project._id} item={project} />
        ))}
      </div>
    </Layout>
  );
};

export default ProjectsGridV2Page;
