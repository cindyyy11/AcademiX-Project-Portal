import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Project_Timeline_RightNav.module.css";
import styles2 from "../../../styles/Student_Timeline.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faCircleInfo,
  faLightbulb,
  faListCheck,
  faUpload,
  faGraduationCap,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const Project_Timeline_RightNav: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  return (
    <>
      <nav className={styles.timelineRight}>
        <Link
          href="/projects/Student/projects-list-v2"
          className={styles2.projectSummaryTitle}
        >
          ALL PROJECTS
        </Link>
        <br />
        <br />
        <span className={styles2.projectSummarySubtitle}>MILESTONES</span>
        <ul>
          <CustomLink
            href={`/projects/Student/timeline-1view-case-study/?id=${id}`}
          >
            <button
              className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}
            >
              <span>
                <FontAwesomeIcon icon={faCircleQuestion} />
              </span>
              &ensp;&nbsp;1. View Case Study
            </button>
          </CustomLink>
          <CustomLink
            href={`/projects/Student/timeline-2suggested-resource/?id=${id}`}
          >
            <button
              className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}
            >
              <span>
                <FontAwesomeIcon icon={faCircleInfo} />
              </span>
              &ensp;&nbsp;2. Suggested Resources
            </button>
          </CustomLink>
          <CustomLink href={`/projects/Student/timeline-3proposal/?id=${id}`}>
            <button
              className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}
            >
              <span>
                <FontAwesomeIcon icon={faLightbulb} />
              </span>
              &ensp;&nbsp;3. Proposal
            </button>
          </CustomLink>
          <CustomLink
            href={`/projects/Student/timeline-4project-planning/?id=${id}`}
          >
            <button
              className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}
            >
              <span>
                <FontAwesomeIcon icon={faListCheck} />
              </span>
              &ensp;&nbsp;4. Project Planning
            </button>
          </CustomLink>
          <CustomLink
            href={`/projects/Student/timeline-5final-documentation/?id=${id}`}
          >
            <button
              className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}
            >
              <span>
                <FontAwesomeIcon icon={faUpload} />
              </span>
              &ensp;&nbsp;5. Final Documentation
            </button>
          </CustomLink>
          <CustomLink
            href={`/projects/Student/timeline-6result-&-review/?id=${id}`}
          >
            <button
              className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}
            >
              <span>
                <FontAwesomeIcon icon={faGraduationCap} />
              </span>
              &ensp;&nbsp;6. Result & Review
            </button>
          </CustomLink>
          <CustomLink href={`/projects/Student/timeline-7feedback/?id=${id}`}>
            <button
              className={`hover:bg-purple-100 ${styles2.projectSummaryNav}`}
            >
              <span>
                <FontAwesomeIcon icon={faMessage} />
              </span>
              &ensp;&nbsp;7. Feedback
            </button>
          </CustomLink>
        </ul>
      </nav>
    </>
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
    (href.startsWith("/projects/Student/timeline-1view-case-study") &&
      router.pathname.startsWith("/projects/Student/timeline-1view-case-study")) ||
      (href.startsWith("/projects/Student/timeline-2suggested-resource") &&
      router.pathname.startsWith("/projects/Student/timeline-2suggested-resource")) ||
      (href.startsWith("/projects/Student/timeline-3proposal") &&
      router.pathname.startsWith("/projects/Student/timeline-3proposal")) ||
      (href.startsWith("/projects/Student/timeline-4project-planning") &&
      router.pathname.startsWith("/projects/Student/timeline-4project-planning")) ||
      (href.startsWith("/projects/Student/timeline-5final-documentation") &&
      router.pathname.startsWith("/projects/Student/timeline-5final-documentation")) ||
      (href.startsWith("/projects/Student/timeline-6result-&-review") &&
      router.pathname.startsWith("/projects/Student/timeline-6result-&-review")) ||
      (href.startsWith("/projects/Student/timeline-7feedback") &&
      router.pathname.startsWith("/projects/Student/timeline-7feedback"));

  return (
    <li className={isActive ? styles.active : ""}>
      <Link href={href} passHref {...props}>
        {children}
      </Link>
    </li>
  );
};

export default Project_Timeline_RightNav;
