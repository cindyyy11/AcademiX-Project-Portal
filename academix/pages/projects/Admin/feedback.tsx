/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useState, useEffect } from "react";
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
import { motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Admin_Timeline_Header from "pages/projects/timeline-components/Admin_Timeline_Header";
import Layout from "@/components/Layout";
import styles from "styles/Student_Timeline.module.css";
import { useRouter } from "next/router";

type Feedback = {
  _id: string;
  feedbackId: string;
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

interface MemberData {
  name: string;
  Rate: number;
  amt: number;
  TotalRate: number;
}

const Admin_Feedback: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedProjectFeedback, setSelectedProjectFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    async function fetchFeedback() {
      if (!id) return;

      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/get-feedback/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Fetched feedback details:", data);

        setFeedback(data.feedbackDetails);
        setSelectedProjectFeedback(data.feedbackDetails); // Initialize selected project feedback
      } catch (error) {
        console.error("Failed to fetch feedback details:", error);
      }
    }

    fetchFeedback();
  }, [id]);

  console.log("Feedback:", feedback);

  const handleCheckboxChange = (index: number) => async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const { checked } = event.target;
    const updatedFeedback = [...selectedProjectFeedback];
    updatedFeedback[index].adminReadStatus = checked;
    setSelectedProjectFeedback(updatedFeedback);
    console.log("Updated feedback:", updatedFeedback);

    // Update backend using PUT request
    const feedbackID = updatedFeedback[index].feedbackId; // Replace with actual feedback ID field name
    console.log("Feedback ID:", feedbackID);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/edit-feedback-status/${feedbackID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your actual auth method
          },
          body: JSON.stringify({ adminReadStatus: checked }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update feedback status");
      }
      console.log("Feedback status updated successfully");
    } catch (error) {
      console.error("Error updating feedback status:", error);
    }
  };

  return (
    <>
      <Layout>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className={styles.timeline}
        >
          <div className={styles.timelineWrapper2}>
            <Admin_Timeline_Header />
            <div className={`${styles.timelineMiddle} w-full`}>
              <div className={styles.timelineMiddle3}>
                <div className={styles.timelineSectionTitle}>FEEDBACK</div>
              </div>

              <div className={styles.timelineMiddle4}>
                <div className={styles.timelineSectionDescription}>
                  Feedback is a crucial component of the project lifecycle,
                  providing insights and evaluations from various stakeholders
                  about the project&apos;s progress, quality, and outcomes. It helps
                  identify strengths and areas for improvement, ensuring that
                  the final deliverables meet or exceed expectations.
                  Constructive feedback fosters continuous improvement, enhances
                  team performance, and aligns the project outcomes with the
                  stakeholders&apos; needs and objectives. By actively seeking and
                  integrating feedback, project teams can make informed
                  decisions, address issues proactively, and achieve a higher
                  standard of excellence in their work.
                </div>
              </div>

              <div
                className=" flex items-center justify-center flex-col pl-6 pt-18 pb-5 sticky top-0"
                style={{ backgroundColor: "#FAF4F0", zIndex: "3" }}
              >
                <h3 className="italic text-2xl  mb-3 text-center">
                  Current Project:
                </h3>
                <select
                  className="w-2/4 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Project ID: {feedback[0]?.projectId}</option>
                  <option>
                    {selectedProjectFeedback.length > 0}
                  </option>
                </select>
              </div>

              <div className={styles.timelineMiddle6}>
                <h3 className="font-bold text-2xl mt-6 mb-3">Feedbacks</h3>
                <p style={{ marginBottom: "-30px" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolore, in, accusamus, repudiandae quae iure debitis animi
                  quisquam labore ab itaque suscipit. Perspiciatis iste ut
                  excepturi amet magnam atque repellat rem.
                </p>
                <br />
                <div className="overflow-x-auto mt-5">
                  <table className="dui-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        {/* <th className="text-center">Role</th> */}
                        <th className="text-center">Date</th>
                        <th className="text-center">Feedback</th>
                        <th className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProjectFeedback.map((item, index) => (
                        <tr key={index}>
                          <th className="w-64">
                            <div className="flex items-center gap-3">
                              <div className="dui-avatar">
                                <div className="w-12 rounded-full">
                                  <img
                                    src="/assets/unknownUser.jpg"
                                    alt="dui-avatar"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">Member {index+1}: {item.userId}</div>
                              </div>
                            </div>
                          </th>
                          {/* <td className="text-center">Member</td> */}
                          <td className="text-center">{item.createdAt.split("T")[0]}</td>
                          <td>{item.feedback}</td>
                          <td>
                            <label className="dui-btn dui-btn-circle dui-swap dui-swap-rotate bg-white border-black hover:bg-white hover:border-gray">
                            <input
                                type="checkbox"
                                style={{ display: "none" }}
                                checked={item.adminReadStatus}
                                onChange={handleCheckboxChange(index)}
                              />
                              <svg
                                className="dui-swap-off fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 512 512"
                              >
                                <circle
                                  cx="256"
                                  cy="256"
                                  r="256"
                                  fill="#ffffff"
                                />
                              </svg>
                              <svg
                                className="dui-swap-on fill-current text-green-600"
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 512 512"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </svg>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.timelineMiddle6}>
                <h3 className="font-bold text-2xl mt-6 mb-3">
                  Project Ratings
                </h3>
                <p style={{ marginBottom: "-30px" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolore, in, accusamus, repudiandae quae iure debitis animi
                  quisquam labore ab itaque suscipit. Perspiciatis iste ut
                  excepturi amet magnam atque repellat rem.
                </p>
                <br />
                <h3 className="font-medium text-xl mt-10 underline underline-offset-8">
                  Purpose & Relevance
                </h3>
                <ResponsiveContainer width="80%" height={400}>
                  <BarChart
                    width={500}
                    height={300}
                    data={selectedProjectFeedback.map((item, index) => ({
                      name: `Member ${index + 1}`,
                      Rate: item.PurposeRelevanceRating,
                      TotalRate: 5 - item.PurposeRelevanceRating,
                    }))}
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
                    <Bar dataKey="Rate" stackId="a" fill="#ffda54" />
                    <Bar dataKey="TotalRate" stackId="a" fill="#FAE8A4" />
                  </BarChart>
                </ResponsiveContainer>

                <h3 className="font-medium text-xl mt-10 underline underline-offset-8">
                  Time Given
                </h3>
                <ResponsiveContainer width="80%" height={400}>
                  <BarChart
                    width={500}
                    height={300}
                    data={selectedProjectFeedback.map((item, index) => ({
                      name: `Member ${index + 1}`,
                      Rate: item.TimeGivenRating,
                      TotalRate: 5 - item.TimeGivenRating,
                    }))}
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
                    <Bar dataKey="Rate" stackId="a" fill="#E99898" />
                    <Bar dataKey="TotalRate" stackId="a" fill="#FBEAEA" />
                  </BarChart>
                </ResponsiveContainer>

                <h3 className="font-medium text-xl mt-10 underline underline-offset-8">
                  Satisfaction
                </h3>
                <ResponsiveContainer width="80%" height={400}>
                  <BarChart
                    width={500}
                    height={300}
                    data={selectedProjectFeedback.map((item, index) => ({
                      name: `Member${index + 1}`,
                      Rate: item.SatisfactionRating,
                      TotalRate: 5 - item.SatisfactionRating,
                    }))}
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
                    <Bar dataKey="Rate" stackId="a" fill="#98E9AB" />
                    <Bar dataKey="TotalRate" stackId="a" fill="#EAFBEE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </m.div>
      </Layout>
    </>
  );
};

export default Admin_Feedback;
