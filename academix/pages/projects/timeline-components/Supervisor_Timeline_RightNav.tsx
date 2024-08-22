import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import style from "./Project_Timeline_RightNav.module.css";
import styles2 from "../../../styles/Student_Timeline.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faSquarePollVertical,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";

const Supervisor_Timeline_RightNav: React.FC = () => {

  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  return (
    <nav className={style.timelineRight}>
      <Link href="/projects/Supervisor/projects-list-v2"  className={styles2.projectSummaryTitle}>
        ALL PROJECTS
      </Link>
      <br />
      <br />
      <span className={styles2.projectSummarySubtitle}>MILESTONES</span>
      <ul>
        <CustomLink href={`/projects/Supervisor/timeline-setting?id=${id}`}>
          <button className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}>
            <span>
              <FontAwesomeIcon icon={faGear} />
            </span>
            &ensp;&nbsp;1. Project Setting
          </button>
        </CustomLink>
        <CustomLink href={`/projects/Supervisor/timelinesubmission?id=${id}`}>
          <button className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}>
            <span>
              <FontAwesomeIcon icon={faSquarePollVertical} />
            </span>
            &ensp;&nbsp;2. Student Submission
          </button>
        </CustomLink>
        <CustomLink href={`/projects/Supervisor/feedback?id=${id}`}>
          <button className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}>
            <span>
              <FontAwesomeIcon icon={faMessage} />
            </span>
            &ensp;&nbsp;3. Feedback
          </button>
        </CustomLink>
      </ul>
    </nav>
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
    (href.startsWith("/projects/Supervisor/timeline-setting") &&
      router.pathname.startsWith("/projects/Supervisor/timeline-setting")) ||
      (href.startsWith("/projects/Supervisor/timelinesubmission") &&
      router.pathname.startsWith("/projects/Supervisor/timelinesubmission")) ||
      (href.startsWith("/projects/Supervisor/feedback") &&
      router.pathname.startsWith("/projects/Supervisor/feedback"));

  return (
    <li className={isActive ? style.active : ""}>
      <Link href={href} passHref {...props}>
        {children}
      </Link>
    </li>
  );
};


export default Supervisor_Timeline_RightNav;
