import styles from "../../../../styles/Student_Timeline.module.css";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { motion as m } from "framer-motion";
import { useRouter } from "next/router";

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

type CaseStudy = {
  title: string;
  description: string;
  caseStudyDir: string;
  status: string;
  datetime: string;
  createdAt: string;
  updatedAt: string;
};

const Supervisor_Timeline_1ViewCaseStudy: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  //Project Details ------------------------------------------------

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
        const dataProject = await response.json();
        console.log("Fetched project details:", dataProject);
        console.log("Response URL is: ", response.url);

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
        } = dataProject.projectDetails;

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
          //   idKey: _id.toString() || "",
        });
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    }

    fetchProjectDetails();
  }, [id]);

  console.log("projectDetails:", projectDetails);

  const [caseStudy, setCaseStudy] = useState<CaseStudy>({
    title: "",
    description: "",
    caseStudyDir: "",
    status: "",
    datetime: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (id) {
      fetchCaseStudy(id as string);
    }
  }, [id]);

  async function fetchCaseStudy(caseStudyId: string) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/get-case-study/${caseStudyId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const dataCaseStudy = await response.json();
      console.log("Fetched case study", dataCaseStudy);

      if (dataCaseStudy && dataCaseStudy.caseStudyDetails) {
        const {
          title,
          description,
          caseStudyDir,
          status,
          datetime,
          timestamp,
          updatedAt,
        } = dataCaseStudy.caseStudyDetails;

        console.log("Extracted details:", {
          title,
          description,
          caseStudyDir,
          status,
          datetime,
          timestamp,
          updatedAt,
        });

        setCaseStudy({
          title: title || "",
          description: description || "",
          caseStudyDir: caseStudyDir || "",
          status: status || "",
          datetime: datetime
            ? new Date(datetime).toISOString().split("T")[0]
            : "",
          createdAt: timestamp
            ? new Date(timestamp).toISOString().split("T")[0]
            : "",
          updatedAt: updatedAt
            ? new Date(updatedAt).toISOString().split("T")[0]
            : "",
        });

        console.log("Updated case study state:", {
          title: title || "",
          description: description || "",
          caseStudyDir: caseStudyDir || "",
          status: status || "",
          datetime: datetime
            ? new Date(datetime).toISOString().split("T")[0]
            : "",
          createdAt: timestamp
            ? new Date(timestamp).toISOString().split("T")[0]
            : "",
          updatedAt: updatedAt
            ? new Date(updatedAt).toISOString().split("T")[0]
            : "",
        });
      } else {
        console.error("Unexpected response structure:", dataCaseStudy);
      }
    } catch (error) {
      console.error("Failed to fetch case study:", error);
    }
  }

  const SUPERVISOR_NAME = "Justin Gilbert";
  const PROJECT_NAME = "System Development Process";
  const PROJECT_OBJECTIVE =
    "1.	Be able to design, develop, test and implement an extensive application. 2.	Develop professional competency in teamwork and co-ordination within a set period. 3.	Be able to present a software development project professionally.";

  const ruleAgreementKey = "rule-agreed";
  const [toggled, setToggled] = useState(() => {
    const savedState = localStorage.getItem(ruleAgreementKey);
    return savedState === "true";
  });

  const viewCaseStudyKey = "view-case-study-completed";
  const [viewCaseStudyCompleted, setViewCaseStudyCompleted] = useState(() => {
    const savedState = localStorage.getItem(viewCaseStudyKey);
    return savedState === "true";
  });

  return (
    <>
      <div className={styles.projecttimeline}>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className={styles.timelineMiddle}
        >
          <div className={styles.timelineMiddle3}>
            <div className={styles.timelineSectionTitle}>VIEW CASE STUDY</div>
            <button
              className={`${styles.markAsCompletedBtn} ${
                viewCaseStudyCompleted ? styles.completed : ""
              }`}
              onClick={() => setViewCaseStudyCompleted(!viewCaseStudyCompleted)}
            >
              Mark As Complete
            </button>
          </div>
          <div className={styles.timelineMiddle4}>
            <div className={styles.timelineSectionDescription}>
              Hi, I&apos;m <strong>{projectDetails.supervisorName}</strong>.
              Welcome to this <strong>{projectDetails.title}</strong> project!
              Thank you for joining me.
              <br />
              <br />
              The objectives of having this project are:{" "}
              {projectDetails.objective}
            </div>
          </div>
          <div className={styles.timelineMiddle6}>
            <h3 className="font-bold text-2xl mt-6 mb-3">Title: {caseStudy.title}</h3>
              {caseStudy.description}<br></br><br></br>
            <p>
              Don&apos;t forget to download the case study below. Responsibly
              read through the question requirement and you are ready to go!
              Good luck and have fun! <br></br>
              <br></br>
            </p>
            <a
              href={caseStudy.caseStudyDir}
              download="CaseStudy"
              className={styles.downloadBtn}
              target="_blank"
            >
              Download&nbsp;
              <span>
                <FontAwesomeIcon icon={faDownload} className={styles.icon} />
              </span>
            </a>
          </div>
          <div className={styles.timelineMiddle5}>
            <h3 className="font-bold text-2xl mt-6 mb-3">
              Ethical Guidelines and Compliance Rules
            </h3>
            <ol className={styles.timelineMiddle5Wrapper}>
              <li className="list-disc text-xl">
                Academic Integrity and Originality
              </li>
              <p>
                Students must ensure that all submitted work is original and
                free from plagiarism. Proper citation of all sources and
                references is mandatory. Engaging in any form of academic
                dishonesty, including cheating or fabricating data, is strictly
                prohibited. Adhering to university policies on academic conduct
                is essential for maintaining academic integrity.
              </p>
              <br />
              <li className="list-disc text-xl">
                Respect for Intellectual Property
              </li>
              <p>
                Intellectual property rights must be respected at all times.
                Students should obtain necessary permissions for using
                copyrighted materials and avoid unauthorized use of others&apos;
                work. Proper attribution should be given to all collaborators
                and advisors, ensuring that all contributions to the project are
                appropriately acknowledged.
              </p>
              <br />
              <li className="list-disc text-xl">
                Data Privacy and Confidentiality
              </li>
              <p>
                Protecting sensitive data and respecting privacy regulations are
                crucial. Students must maintain the confidentiality of all
                project-related information and follow ethical guidelines when
                conducting research, particularly when human or animal subjects
                are involved. Obtaining necessary approvals from ethics
                committees is required when applicable.
              </p>
              <br />
              <li className="list-disc text-xl">
                Professional Conduct and Communication
              </li>
              <p>
                Professionalism should be exhibited in all project-related
                activities. This includes communicating respectfully and
                effectively with team members, advisors, and stakeholders. Using
                university resources responsibly and efficiently, and adhering
                to any specific usage guidelines provided, is also expected.
              </p>
              <br />
              <li className="list-disc text-xl">
                Compliance with Deadlines and Regulations
              </li>
              <p>
                Meeting all deadlines for submissions and project milestones is
                crucial. Students should inform advisors in advance if any
                delays are anticipated. Additionally, all applicable laws,
                regulations, and university policies related to the project must
                be followed, ensuring compliance with health and safety
                standards in project work.
              </p>
            </ol>
            <div className={styles.markAsAgreed}>
              **By clicking the toggle, you agreed the ethical guidelines and
              compliance rules above&nbsp;&nbsp;
              <button
                className={`${styles.toggleBtn} ${
                  toggled ? styles.toggled : ""
                }`}
                onClick={() => setToggled(!toggled)}
              >
                <div className={styles.thumb}></div>
              </button>
            </div>
          </div>
        </m.div>
      </div>
    </>
  );
};

export default Supervisor_Timeline_1ViewCaseStudy;
