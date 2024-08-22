import Link from "next/link";
import { useRouter } from "next/router";
import style from "../../../styles/Student_Timeline.module.css";
import { useState, useEffect } from "react";

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

const Admin_Timeline_Header: React.FC = () => {
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

  return (
    <div className={style.timeline}>
      <div className={style.timelineMiddle}>
        <div className={style.timelineMiddle1}>
          <div className={style.projectTitle}>{projectDetails.title}</div>
          <div className={style.projectDescription}>
            {projectDetails.about}{" "}
          </div>
        </div>
        <nav className={style.timelineMiddle2}>
          <CustomLink href={`/projects/Admin/timeline-list?id=${id}`}>
            <button className={style.timelineNav2}>Timeline</button>
          </CustomLink>
          <CustomLink href={`/projects/Admin/feedback?id=${id}`}>
            <button className={style.timelineNav2}>Feedback</button>
          </CustomLink>
          <CustomLink href={`/projects/Admin/projectdetails?id=${id}`}>
            <button className={style.timelineNav2}>Project Details</button>
          </CustomLink>
          <CustomLink href={`/projects/Admin/projectmembers?id=${id}`}>
            <button className={style.timelineNav2}>Members</button>
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
  const isActive =
    router.pathname.startsWith(href) ||
    (href.startsWith("/projects/Admin/timeline") &&
      router.pathname.startsWith("/projects/Admin/timeline")) ||
    (href.startsWith("/projects/Admin/feedback") &&
      router.pathname.startsWith("/projects/Admin/feedback")) ||
    (href.startsWith("/projects/Admin/projectdetails") &&
      router.pathname.startsWith("/projects/Admin/projectdetails")) ||
    (href.startsWith("/projects/Admin/projectmembers") &&
      router.pathname.startsWith("/projects/Admin/projectmembers"));

  return (
    <li className={isActive ? style.headerActive : ""}>
      <Link href={href} passHref {...props}>
        {children}
      </Link>
    </li>
  );
};

export default Admin_Timeline_Header;
