// import type { NextPage } from "next";
// import ProjectsListV2Page from "@/templates/ProjectManagement/ProjectsListV2Page/Index";

// const Projects: NextPage = () => {
//     return (
//         <>
//             <ProjectsListV2Page />
//         </>
//     );
// };

// export default Projects;

import type { NextPage } from "next";
import ProjectsListV2Page from "@/templates/ProjectManagement/ProjectsListV2Page/Index";
import ProjectsEmptyPage from "@/templates/ProjectManagement/ProjectsEmptyPage";
import { useEffect, useState } from "react"; // Import useEffect and useState hooks for managing state

const Projects: NextPage = () => {
  const [projects, setProjects] = useState<any[]>([]); // State to hold projects, initialized as an empty array

  useEffect(() => {
    // Simulate fetching projects from an API or database
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Replace with actual API call to fetch projects
    try {
      const response = await fetch('http://localhost:8000/api/v1/get-all-projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects); // Assuming API returns an array of projects
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <>
      {projects.length > 0 ? (
        <ProjectsListV2Page />
      ) : (
        <ProjectsEmptyPage />
      )}
    </>
  );
};

export default Projects;