import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../../styles/Student_Timeline.module.css";

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
  supervisor: string;
  supervisorName: string;
  users: string[]; // Define users as an array of strings for URLs
  _id: string; // Make _id optional
  //   idKey: Mongoose.Types.ObjectId; // Use Mongoose.Types.ObjectId for idKey
};

const Student_Timeline_Header: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  // console.log("id:", id);

  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    title: "",
    logo: "",
    about: "",
    objective: "",
    categories: "",
    taskDone: 0,
    tasksAll: 0,
    handOutDate: null,
    dueDate: null,
    supervisor: "",
    supervisorName: "",
    users: [],
    _id: "",
    // idKey: new Mongoose.Types.ObjectId(),
  });

  // Fetch initial project details from the backend
  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/get-single-project/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched project details:", data);

        const {
          title,
          logo,
          about,
          objective,
          categories,
          taskDone,
          tasksAll,
          handOutDate,
          dueDate,
          supervisor,
          users,
          _id,
        } = data.projectDetails;
        setProjectDetails({
          title: title || "",
          logo: logo || "",
          about: about || "",
          objective: objective || "",
          categories: categories || "",
          taskDone: taskDone || 0,
          tasksAll: tasksAll || 0,
          handOutDate: handOutDate.toString().split("T")[0],
          dueDate: dueDate.toString().split("T")[0],
          supervisor: supervisor || "",
          supervisorName: supervisor.name,
          users: users || [],
          _id: _id || "",
        });
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    }

    fetchProjectDetails();
  }, [id]);

  // console.log("projectDetails:", projectDetails);

  return (
    <div className={styles.projecttimeline}>
      <div className={styles.timelineMiddle}>
        <div className={styles.timelineMiddle1}>
          <div className={styles.projectTitle}>{projectDetails.title}</div>
          <div className={styles.projectDescription}>
            {projectDetails.about}
          </div>
        </div>
        <nav className={styles.timelineMiddle2}>
          <CustomLink
            href={`/projects/Student/timeline-1view-case-study?id=${id}`}
          >
            <button className={styles.timelineNav2}>Timeline</button>
          </CustomLink>
          <CustomLink href={`/projects/Student/projectdetails?id=${id}`}>
            <button className={styles.timelineNav2}>Project Details</button>
          </CustomLink>
          <CustomLink href={`/projects/Student/projectmembers?id=${id}`}>
            <button className={styles.timelineNav2}>Members</button>
          </CustomLink>
        </nav>
      </div>
    </div>
  );
};

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  children,
  ...props
}) => {
  const router = useRouter();
  const isActive = router.pathname.startsWith(href) || (href.startsWith("/projects/Student/timeline") && router.pathname.startsWith("/projects/Student/timeline")) || (href.startsWith("/projects/Student/projectdetails") && router.pathname.startsWith("/projects/Student/projectdetails")) || (href.startsWith("/projects/Student/projectmembers") && router.pathname.startsWith("/projects/Student/projectmembers"));

  return (
    <li className={isActive ? styles.headerActive : ""}>
      <Link href={href} passHref {...props}>
        {children}
      </Link>
    </li>
  );
};

export default Student_Timeline_Header;
