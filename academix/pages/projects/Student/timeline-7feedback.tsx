import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Student_Timeline_Header from "../timeline-components/Student_Timeline_Header";
import Project_Timeline_RightNav from "../timeline-components/Project_Timeline_RightNav";
import { motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../styles/Student_Timeline.module.css";

type Supervisor = {
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  lastSeen: string;
  lastSeenDateTime: string;
};

type ProjectDetails = {
  title: string;
  about: string;
  objective: string;
  handOutDate: Date | null;
  dueDate: Date | null;
  supervisor: Supervisor | null;
  supervisorId: string;
  members: [];
  _id?: string;
};

type Feedback = {
  projectId: string;
  userId: string;
  PurposeRelevanceRating: number;
  TimeGivenRating: number;
  SatisfactionRating: number;
  feedback: string;
  adminReadStatus: boolean;
  createdAt: string;
  updatedAt: string;
};

const Student_Timeline_7Feedback = () => {
  const router = useRouter();
  const { id } = router.query;

  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(
    null
  );
  const [formState, setFormState] = useState<Feedback>({
    projectId: id as string,
    userId: "",
    PurposeRelevanceRating: 0,
    TimeGivenRating: 0,
    SatisfactionRating: 0,
    feedback: "",
    adminReadStatus: false,
    createdAt: "",
    updatedAt: "",
  });

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submissionDatetime, setSubmissionDatetime] = useState<Date | null>(
    null
  );

  useEffect(() => {
    async function fetchProjectDetails() {
      if (!id) return;

      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/get-single-project/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Fetched project details:", data);

        setProjectDetails(data.projectDetails);
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    }

    fetchProjectDetails();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    alert("Your feedback is successfully submitted!!");
    setFeedbackSubmitted(true);
    setSubmissionDatetime(now);

    const existingSubmissions = JSON.parse(
      localStorage.getItem("submission-dates") || "[]"
    );
    const updatedSubmissions = [...existingSubmissions, now.toString()];
    localStorage.setItem(
      "submission-dates",
      JSON.stringify(updatedSubmissions)
    );

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/create-feedback/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const updatedFeedback = await response.json();
      console.log("Updated feedback details:", updatedFeedback);
      setFeedback(updatedFeedback); // Update feedback state after submission
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
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
              <div className={styles.timelineSectionTitle}>FEEDBACK</div>
            </div>

            <div className={styles.timelineMiddle4}>
              <div className={styles.timelineSectionDescription}>
                Feedback is a crucial component of the project lifecycle,
                providing insights and evaluations from various stakeholders
                about the project's progress, quality, and outcomes. It helps
                identify strengths and areas for improvement, ensuring that the
                final deliverables meet or exceed expectations. Constructive
                feedback fosters continuous improvement, enhances team
                performance, and aligns the project outcomes with the
                stakeholders' needs and objectives. By actively seeking and
                integrating feedback, project teams can make informed decisions,
                address issues proactively, and achieve a higher standard of
                excellence in their work.
              </div>
            </div>

            <div className={styles.timelineMiddle6}>
              {!feedbackSubmitted ? (
                <div>
                  <h3 className="font-bold text-2xl mt-6 mb-3">
                    Provide us feedback regarding the project!
                  </h3>
                  <p style={{ marginBottom: "-30px" }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolore, in, accusamus, repudiandae quae iure debitis animi
                    quisquam labore ab itaque suscipit. Perspiciatis iste ut
                    excepturi amet magnam atque repellat rem.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4">
                              Project
                            </h2>
                            <div className="mt-2">
                              <input
                                type="text"
                                name="project"
                                id="project"
                                value={projectDetails?.title || ""}
                                readOnly
                                className="dui-input dui-input-bordered w-full max-w-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <h2 className="text-base font-semibold leading-7 text-gray-900 mt-4">
                            Your Name
                          </h2>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="userId"
                              id="userId"
                              autoComplete="name"
                              className="dui-input dui-input-bordered w-full max-w-xs"
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="mt-12">
                          <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                            Ratings
                          </h2>

                          <div className="mt-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Purpose and Relevance
                            </label>
                            <div className="dui-rating">
                              <input
                                type="radio"
                                name="PurposeRelevanceRating"
                                value={1}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="PurposeRelevanceRating"
                                value={2}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="PurposeRelevanceRating"
                                value={3}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="PurposeRelevanceRating"
                                value={4}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="PurposeRelevanceRating"
                                value={5}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Time Given to Complete the Project
                            </label>
                            <div className="dui-rating">
                              <input
                                type="radio"
                                name="TimeGivenRating"
                                value={1}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="TimeGivenRating"
                                value={2}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="TimeGivenRating"
                                value={3}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="TimeGivenRating"
                                value={4}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="TimeGivenRating"
                                value={5}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Overall Satisfaction
                            </label>
                            <div className="dui-rating">
                              <input
                                type="radio"
                                name="SatisfactionRating"
                                value={1}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="SatisfactionRating"
                                value={2}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="SatisfactionRating"
                                value={3}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="SatisfactionRating"
                                value={4}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                              <input
                                type="radio"
                                name="SatisfactionRating"
                                value={5}
                                className="dui-mask dui-mask-star-2 bg-yellow-400"
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label
                              htmlFor="feedback"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Feedback
                            </label>
                            <div className="mt-2">
                              <textarea
                                id="feedback"
                                name="feedback"
                                rows={4}
                                className="dui-textarea dui-textarea-bordered w-full max-w-xs"
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="mt-6 flex items-center justify-start gap-x-6">
                            <button
                              type="submit"
                              className="dui-btn dui-btn-outline"
                            >
                              Submit Feedback
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="mt-3 dui-mockup-browser bg-base-300 border">
                  <div className="dui-mockup-browser-toolbar">
                    <div className="dui-input">https://AcademiXProjectPortal.com</div>
                  </div>
                  <div className="bg-base-200 flex justify-center px-4 py-16">
                    <div className="flex justify-center items-center flex-col">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="w-26 h-26 text-5xl text-green-500"
                      />
                      <p className="mt-4 text-lg"><strong>Feedback submitted successfully!</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </m.div>
        </div>
        <Project_Timeline_RightNav />
      </div>
    </Layout>
  );
};

export default Student_Timeline_7Feedback;
