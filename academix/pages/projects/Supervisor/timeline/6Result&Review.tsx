import React, { useState, useEffect } from "react";
import styles from "../../../../styles/Student_Timeline.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faDownload,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import { motion as m } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/router";

const Supervisor_Timeline_6ResultAndReview = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);
  const [grade, setGrade] = useState<{
    resultTranscripts?: string;
    proposalMarks: number;
    finalDocumentationMarks: number;
    programImplementationMarks: number;
    overallReview: string;
    totalMarks: number; // Calculated: Total marks summing up all components
    createdAt: string;
    updatedAt: string;
  }>({
    resultTranscripts: "",
    proposalMarks: 0,
    finalDocumentationMarks: 0,
    programImplementationMarks: 0,
    overallReview: "",
    totalMarks: 0, // Calculated: Total marks summing up all components
    createdAt: "",
    updatedAt: "",
  });

  // Fetch initial project details from the backend
  useEffect(() => {
    async function fetchGradeDetails() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/get-grade/${id}`
        );
        const data = await response.json();
        console.log("Fetched grading details:", data); // Log the fetched data

        const {
          resultTranscripts,
          proposalMarks,
          finalDocumentationMarks,
          programImplementationMarks,
          overallReview,
          totalMarks, // Calculated: Total marks summing up all components
          createdAt,
          updatedAt,
        } = data.gradeDetails;

        setGrade({
          resultTranscripts: resultTranscripts || "",
          proposalMarks: proposalMarks || 0,
          finalDocumentationMarks: finalDocumentationMarks || 0,
          programImplementationMarks: programImplementationMarks || 0,
          overallReview: overallReview || "",
          totalMarks: totalMarks || 0, // Calculated: Total marks summing up all components
          createdAt: createdAt || "",
          updatedAt: updatedAt || "",
        });
      } catch (error) {
        console.error("Failed to fetch grading details:", error);
      }
    }

    fetchGradeDetails();
  }, [id]);

  console.log("grade:", grade);

  const resultData = [
    {
      name: "Proposal (20%)",
      DeductedMarks: 100 - grade.proposalMarks,
      YourMarks: grade.proposalMarks,
      amt: 2400,
    },
    {
      name: "Final Documentation (40%)",
      DeductedMarks: 100 - grade.finalDocumentationMarks,
      YourMarks: grade.finalDocumentationMarks,
      amt: 2210,
    },
    {
      name: "Program Implementation (40%)",
      DeductedMarks: 100 - grade.programImplementationMarks,
      YourMarks: grade.programImplementationMarks,
      amt: 2290,
    },
  ];

  const resultReviewKey = "result-review-completed";
  const [resultReviewCompleted, setResultReviewCompleted] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(resultReviewKey);
      return savedState === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(resultReviewKey, resultReviewCompleted.toString());
  }, [resultReviewCompleted]);

  const LecturerReview =
    "Overall, the project has been executed excellently. The proposal was well-written and provided a clear understanding of the project goals and objectives. The documentation was comprehensive and organized, making it easy to follow the project's progress. The implementation of the programming was done with precision and attention to detail. The code was clean and efficient, showcasing a strong understanding of programming concepts. Great job on completing all aspects of the project!";

  const people = [
    {
      name: "Tom Cook",
      email: "justin.gilbert@apu.edu.my",
      role: "member",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Justin Gilbert Alexius Silvester",
      email: "justin.gilbert@apu.edu.my",
      role: "Lecturer",
      imageUrl: "/assets/JustinGilbert.jpeg",
    },
  ];

  // Parse the dates
  const handOutDate = new Date("March 19, 2024 11:29:00");
  const DateStart = handOutDate.toLocaleDateString("en-GB");
  const dueDate = new Date("June 25, 2024 23:59:00");
  const DateEnd = dueDate.toLocaleDateString("en-GB");

  // Calculate the difference in milliseconds
  const difference = dueDate.getTime() - handOutDate.getTime();

  // Convert the difference
  const minutes = Math.floor(difference / 60000) % 60; // 60000 milliseconds in a minute
  const hours = Math.floor(difference / 3600000) % 24; // 3600000 milliseconds in an hour
  const daysTotal = Math.floor(difference / 86400000); // 86400000 milliseconds in a day

  // Assuming an average month length of 30.44 days for calculation
  const months = Math.floor(daysTotal / 30.44);
  const days = daysTotal % 30.44;

  // Assuming an average year length of 365.25 days for calculation
  const years = Math.floor(daysTotal / 365.25);

  return (
    <div className={styles.projecttimeline}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={styles.timelineMiddle}
      >
        <div className={styles.timelineMiddle3}>
          <div className={styles.timelineSectionTitle}>RESULT & REVIEW</div>
          <a href="">
            <button
              className={`${styles.markAsCompletedBtn} ${
                resultReviewCompleted ? styles.completed : ""
              }`}
              onClick={() => setResultReviewCompleted(!resultReviewCompleted)}
            >
              Mark As Completed
            </button>
          </a>
        </div>

        <div className={styles.timelineMiddle4}>
          <div className={styles.timelineSectionDescription}>
            Results & Review is where you present the findings and outcomes of
            your work. This part should provide a clear, concise, and logical
            presentation of your data, analyses, and observations. It often
            includes visual aids such as charts, graphs, and tables to
            effectively communicate the results. The goal is to illustrate the
            key findings without interpretation or bias, laying the groundwork
            for the subsequent discussion and conclusion sections. This section
            demonstrates the success and validity of your project, highlighting
            how the data supports your initial hypothesis or project goals.
          </div>
        </div>

        <div className={styles.timelineMiddle6}>
          <h3 className="font-bold text-2xl mt-6 mb-3">Result and Review</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, in,
            accusamus, repudiandae quae iure debitis animi quisquam labore ab
            itaque suscipit. Perspiciatis iste ut excepturi amet magnam atque
            repellat rem.
          </p>
          <div className={styles.timelineMiddleX}>
            <a
              href={grade.resultTranscripts}
              download="Result Transcripts"
              className={styles.downloadBtn}
              target="_blank"
            >
              Download&nbsp;
              <FontAwesomeIcon icon={faDownload} className={styles.icon} />
            </a>
          </div>
        </div>

        <div className={styles.timelineMiddle6}>
          <h3 className="font-bold text-2xl mt-6 mb-3">Final Result</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, in,
            accusamus, repudiandae quae iure debitis animi quisquam labore ab
            itaque suscipit. Perspiciatis iste ut excepturi amet magnam atque
            repellat rem.
          </p>
          <div
            className="bg-black text-center text-white py-10 mt-2"
            style={{
              backgroundImage: "url('/assets/celebrate.gif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex justify-center">
              <div className="backdrop-blur-lg flex items-end p-4">
                <span className="text-sm mr-8">TOTAL MARKS:</span>
                <span className="font-bold text-7xl underline decoration-yellow-500 ">
                  {grade.totalMarks}%
                </span>
              </div>
            </div>
          </div>
          <br />

          {/* <div className="flex justify-center">
                <div className="dui-stats shadow">
                  <div className="dui-stat">
                    <div className="dui-stat-figure text-violet-500">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="inline-block w-8 h-8 stroke-current"
                      />
                    </div>
                    <div className="dui-stat-title">Duration</div>
                    <div className="dui-stat-value text-violet-400">
                      {months}m {Math.floor(days)}d
                    </div>
                    <div className="dui-stat-desc">
                      {DateStart} - {DateEnd}
                    </div>
                  </div>

                  <div className="dui-stat">
                    <div className="dui-stat-figure text-red-400">
                      <FontAwesomeIcon
                        icon={faHandshake}
                        className="inline-block w-11 h-11 stroke-current"
                      />
                    </div>
                    <div className="dui-stat-title">Teamwork</div>
                    <div className="dui-stat-value text-red-400">46</div>
                    <div className="dui-stat-desc">
                      tasks in {months} months {Math.floor(days)} days
                    </div>
                  </div>

                  <div className="dui-stat">
                    <div className="dui-stat-figure text-secondary">
                      <div className="dui-avatar dui-online">
                        <div className="w-16 rounded-full">
                          <img src={people[0].imageUrl} alt="" />
                        </div>
                      </div>
                    </div>
                    <div className="dui-stat-value text-green-500">19.5%</div>
                    <div className="dui-stat-title">Workload</div>
                    <div className="dui-stat-desc text-green-500">
                      9 tasks in-charged
                    </div>
                  </div>
                </div>
              </div> */}

          <h3 className="font-medium text-xl mt-10 underline underline-offset-8">
            Marks Distribution
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              width={500}
              height={300}
              data={resultData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis style={{ fill: "black" }} dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="YourMarks" stackId="a" fill="#AE7AFF" />
              <Bar dataKey="DeductedMarks" stackId="a" fill="#EFE4FF" />
            </BarChart>
          </ResponsiveContainer>

          <h3 className="font-medium text-xl mt-6 mb-3 underline underline-offset-8">
            Supervisor Review
          </h3>
          <div className="dui-chat dui-chat-start mt-5">
            <div className="dui-chat-image dui-avatar">
              <div className="w-10 rounded-full">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src="/assets/unknownUser.jpg"
                  alt=""
                />
              </div>
            </div>
            <div className="dui-chat-bubble text-justify bg-yellow-200 text-zinc-700">
              {grade.overallReview}
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
};

export default Supervisor_Timeline_6ResultAndReview;
