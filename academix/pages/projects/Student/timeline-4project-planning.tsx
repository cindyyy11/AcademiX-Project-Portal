/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion as m } from "framer-motion";
import Project_Timeline_RightNav from "../timeline-components/Project_Timeline_RightNav";
import Student_Timeline_Header from "../timeline-components/Student_Timeline_Header";
import CountdownTimer from "../timeline-components/Countdown_Timer";
import people from "../../../mocks/people"; // Adjust path according to your project structure
import Layout from "../../../components/Layout";
import styles from "../../../styles/Student_Timeline.module.css";
import { useRouter } from "next/router";

interface Person {
  name: string;
  email: string;
  imageUrl: string;
}

const Student_Timeline_4ProjectPlanning: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  const [projectDetails, setProjectDetails] = useState<{
    title: string;
    about: string;
    objective: string;
    handOutDate: null | string;
    dueDate: null | string;
    supervisor: null | string;
    supervisorId: string;
    members: Person[];
  }>({
    title: "",
    about: "",
    objective: "",
    handOutDate: "",
    dueDate: "",
    supervisor: null,
    supervisorId: "",
    members: [],
  });

  // Fetch initial project details from the backend
  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/get-single-project/${id}`
        );
        const data = await response.json();
        console.log("Fetched project details:", data); // Log the fetched data

        const {
          title,
          about,
          objective,
          handOutDate,
          dueDate,
          supervisor,
          supervisorId,
          members,
        } = data.projectDetails;

        setProjectDetails({
          title: title || "",
          about: about || "",
          objective: objective || "",
          handOutDate: handOutDate || "",
          dueDate: dueDate || "",
          supervisor: supervisor || "",
          supervisorId: supervisorId || "",
          members: members || [],
        });
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    }

    fetchProjectDetails();
  }, []);

  console.log("projectDetails:", projectDetails.dueDate);

  const projectPlanningKey = "project-planning-completed";
  const [projectPlanningCompleted, setProjectPlanningCompleted] =
    useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(projectPlanningKey);
    if (savedState !== null) {
      setProjectPlanningCompleted(savedState === "true");
    }
  }, []);

  const totalTask = 5;
  const doneTask = 2;

  const handleMarkCompleted = () => {
    setProjectPlanningCompleted(!projectPlanningCompleted);
    localStorage.setItem(
      projectPlanningKey,
      (!projectPlanningCompleted).toString()
    );
  };

  

  return (
    <Layout>
      <Student_Timeline_Header />
      <div className={styles.timelineWrapper}>
        <div className={styles.projecttimeline}>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className={styles.timelineMiddle}
          >
            <div className={styles.timelineMiddle3}>
              <div className={styles.timelineSectionTitle}>
                PROJECT PLANNING
              </div>
              <button
                className={`${styles.markAsCompletedBtn} ${
                  projectPlanningCompleted ? styles.completed : ""
                }`}
                onClick={handleMarkCompleted}
              >
                Mark As Completed
              </button>
            </div>
            <div className={styles.timelineMiddle4}>
              <div className={styles.timelineSectionDescription}>
                Project Planning provides a comprehensive guide to help students
                effectively organize and manage their projects. It includes
                essential tools and strategies for creating detailed and
                actionable project plans, with instructions on setting
                objectives, creating timelines, identifying resources, and
                establishing clear milestones. The page features an embedded
                video tutorial offering practical insights from professionals,
                as well as downloadable templates and checklists to aid the
                planning process. By utilizing these resources, students can
                develop robust project plans that outline every critical aspect
                of their work, ensuring that projects are well-planned,
                organized, and set up for success.
              </div>
            </div>
            <Link href="/projects/kanban-desc">
              <div
                className={`${
                  styles.timelineMiddle6
                } ${"cursor-pointer hover:bg-yellow-50 transition-colors"}`}
              >
                <h3 className="font-bold text-2xl mt-6 mb-3">
                  Manage Your Project Progress
                </h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolore, in, accusamus, repudiandae quae iure debitis animi
                  quisquam labore ab itaque suscipit. Perspiciatis iste ut
                  excepturi amet magnam atque repellat rem.
                </p>
                <div className="flex items-center">
                  <div className="flex-1 flex-col justify-center items-center">
                    <div className="px-4 flex justify-center">
                      <div className="flex flex-row">
                        {people.map((person) => (
                          <div
                            key={person.email}
                            className="flex justify-between gap-x-6 py-5"
                          >
                            <div className="flex min-w-0 gap-x-4">
                              <img
                                className="h-25 w-25 flex-none rounded-full bg-gray-50"
                                src={person.imageUrl}
                                alt=""
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex justify-center">
                        <progress
                          className="dui-progress w-86"
                          value={doneTask}
                          max={totalTask}
                        ></progress>
                      </div>
                      <div className="mt-2 flex flex-row justify-between pl-5 pr-5">
                        <div className="2xl">
                          <strong>{doneTask}</strong> / {totalTask} task
                        </div>
                        <div className="2xl">
                          {((doneTask / totalTask) * 100).toFixed(2)} %
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex justify-center items-center p-5 gap-7">
                    
                    <CountdownTimer dueDate={projectDetails.dueDate} />
                  </div>
                </div>
              </div>
            </Link>

            <div className={styles.completeButtonWrapper}>
              <Link href="/projects/Student/timeline-3proposal">
                <button className={styles.backBtn}>Back</button>
              </Link>
              <Link href="/projects/Student/timeline-5final-documentation">
                <button className={styles.nextBtn}>Next</button>
              </Link>
            </div>
          </m.div>
        </div>
        <Project_Timeline_RightNav />
      </div>
    </Layout>
  );
};

export default Student_Timeline_4ProjectPlanning;
