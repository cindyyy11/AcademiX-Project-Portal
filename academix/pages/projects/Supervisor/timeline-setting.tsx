/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faEye } from "@fortawesome/free-solid-svg-icons";
import rightStyles from "../timeline-components/Project_Timeline_RightNav.module.css";
import styles from "../../../styles/Student_Timeline.module.css";
import Layout from "@/components/Layout";

import SupervisorSetCaseStudy from "./Set/Set_CaseStudy";
import SupervisorPreviewCaseStudy from "./Supervisor_PreviewCaseStudy";

import SupervisorSetResource from "./Set/Set_Resource";
import SupervisorPreviewResource from "./Supervisor_PreviewResources";

import SupervisorSetProposal from "./Set/Set_Proposal";
import SupervisorPreviewProposal from "./Supervisor_PreviewProposal";

import SupervisorPreviewPlanning from "./Supervisor_PreviewPlanning";

import SupervisorSetDoc from "./Set/Set_Doc";
import SupervisorPreviewDoc from "./Supervisor_PreviewDoc";

import SupervisorSetResult from "./Set/Set_Result";
import SupervisorPreviewResult from "./Supervisor_PreviewResult";
import Supervisor_Timeline_RightNav from "../timeline-components/Supervisor_Timeline_RightNav";
import Supervisor_Timeline_Header from "../timeline-components/Supervisor_Timeline_Header";

import { useRouter } from "next/router";
import axios from "axios";

interface ProjectModificationDate {
  caseStudyDate: string;
  resourceDate: string;
  proposalDate: string;
  planningDate: string;
  finalDocDate: string;
  gradeDate: string;
}

// ------------------------------ Supervisor_TimelineList ------------------------------ //
export default function Supervisor_TimelineList() {
  const [projectModificationDate, setProjectModificationDate] =
    useState<ProjectModificationDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const toggleModal = (modal: React.SetStateAction<string | null>) => {
    setActiveModal(activeModal === modal ? null : modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  useEffect(() => {
    const fetchProjectModificationDate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/get-modify-date/${id}`
        );
        if (response.data.success) {
          setProjectModificationDate(response.data.projectModificationDate);
        } else {
          setError("Error fetching project modification date");
        }
      } catch (error) {
        console.error("Error fetching project modification date:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectModificationDate();
    }
  }, [id]);

  console.log(projectModificationDate);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!projectModificationDate) {
    return <p>No project modification date available.</p>;
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <Layout>
        <Supervisor_Timeline_Header />
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className={`${styles.projecttimeline} mb-10`}
        >
          <div className={styles.timelineMiddle}>
            <div className={styles.timelineMiddle3}>
              <div className={styles.timelineSectionTitle}>
                SETTING UP PROJECT
              </div>
            </div>
            <div className={styles.timelineMiddle4}>
              <div className={styles.timelineSectionDescription}>
                Welcome to the Supervisor Timeline Setting Page, where you can
                efficiently manage and configure the timeline and content for
                student projects. Here, you can add and edit milestones, set
                deadlines, and define deliverable requirements to ensure your
                students have a clear and structured roadmap. Customize each
                milestone with titles, descriptions, due dates, and specific
                guidelines, and assign them to individual students or groups.
                This page helps you maintain an organized and coherent timeline,
                making it easy for students to follow and meet their project
                goals.
              </div>
            </div>

            <div className={`${styles.timelineMiddle6} bg-white pt-3 pb-10`}>
              <h3 className="font-bold text-2xl mt-6 mb-3">Settings</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Laborum itaque fuga fugit eius quos iste officiis qui, odit
                omnis. Dolore rerum velit similique quae ad dolorem voluptatibus
                cumque assumenda nihil.
              </p>
              <br></br>
              <div className="dui-overflow-x-auto">
                <table className="dui-table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="text-center">Supervisor Status</th>
                      <th className="text-center">Preview</th>
                      <th className="text-center">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <th className="dui-w-64">
                        <div className="flex items-center gap-3">
                          <div className="dui-avatar">
                            <div className="dui-mask dui-mask-squircle w-12 h-12">
                              <img
                                src="/assets/1.viewcasestudy.jpg"
                                alt="dui-avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">1. View Case Study</div>
                            <div className="text-sm opacity-50">
                              Upload project topic
                            </div>
                          </div>
                        </div>
                      </th>

                      <td className="text-center">
                        Last Modified <br></br>
                        <span className="dui-badge dui-badge-sm bg-black text-white">
                          {formatDate(projectModificationDate.caseStudyDate)}
                        </span>
                      </td>
                      {/* <td className="text-green-500 text-center">DONE</td> */}
                      <th>
                        <button
                          onClick={() => toggleModal("viewCaseStudy")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "viewCaseStudy" && (
                          <SupervisorPreviewCaseStudy onClose={closeModal} />
                        )}
                      </th>
                      <th>
                        <button
                          onClick={() => toggleModal("setCaseStudy")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "setCaseStudy" && (
                          <SupervisorSetCaseStudy onClose={closeModal} />
                        )}
                      </th>
                    </tr>
                    {/* row 2 */}
                    <tr>
                      <th>
                        <div className="flex items-center gap-3">
                          <div className="dui-avatar">
                            <div className="dui-mask dui-mask-squircle w-12 h-12">
                              <img
                                src="/assets/2.suggestedresource.jpg"
                                alt="dui-avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              2. Suggested Resources
                            </div>
                            <div className="text-sm opacity-50">
                              Embed useful references
                            </div>
                          </div>
                        </div>
                      </th>

                      <td className="text-center">
                        Last Modified <br></br>
                        <span className="dui-badge dui-badge-sm bg-black text-white">
                          {formatDate(projectModificationDate.resourceDate)}
                        </span>
                      </td>
                      {/* <td className="text-green-500 text-center">DONE</td> */}
                      <th>
                        <button
                          onClick={() => toggleModal("viewResources")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "viewResources" && (
                          <SupervisorPreviewResource onClose={closeModal} />
                        )}
                      </th>
                      <th>
                        <button
                          onClick={() => toggleModal("setResources")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "setResources" && (
                          <SupervisorSetResource onClose={closeModal} />
                        )}
                      </th>
                    </tr>
                    {/* row 3 */}
                    <tr>
                      <th>
                        <div className="flex items-center gap-3">
                          <div className="dui-avatar">
                            <div className="dui-mask dui-mask-squircle w-12 h-12">
                              <img
                                src="/assets/3.proposal.jpg"
                                alt="dui-avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">3. Proposal</div>
                            <div className="text-sm opacity-50">
                              Provide guidelines
                            </div>
                          </div>
                        </div>
                      </th>

                      <td className="text-center">
                        Last Modified <br></br>
                        <span className="dui-badge dui-badge-sm bg-black text-white">
                          {formatDate(projectModificationDate.proposalDate)}
                        </span>
                      </td>
                      {/* <td className="text-green-500 text-center">DONE</td> */}
                      <th>
                        <button
                          onClick={() => toggleModal("viewProposal")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "viewProposal" && (
                          <SupervisorPreviewProposal onClose={closeModal} />
                        )}
                      </th>
                      <th>
                        <button
                          onClick={() => toggleModal("setProposal")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "setProposal" && (
                          <SupervisorSetProposal onClose={closeModal} />
                        )}
                      </th>
                    </tr>
                    {/* row 4 */}
                    <tr>
                      <th>
                        <div className="flex items-center gap-3">
                          <div className="dui-avatar">
                            <div className="dui-mask dui-mask-squircle w-12 h-12">
                              <img
                                src="/assets/4.projectplanning.jpg"
                                alt="dui-avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">4. Project Planning</div>
                            <div className="text-sm opacity-50">
                              View student's progress
                            </div>
                          </div>
                        </div>
                      </th>

                      <td className="text-center">
                        Last Modified <br></br>
                        <span className="dui-badge dui-badge-sm bg-black text-white">
                          {formatDate(projectModificationDate.proposalDate)}
                        </span>
                      </td>
                      {/* <td className="text-amber-300 text-center">
                        IN PROGRESS
                      </td> */}
                      <th>
                        <button
                          onClick={() => toggleModal("viewPlanning")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "viewPlanning" && (
                          <SupervisorPreviewPlanning onClose={closeModal} />
                        )}
                      </th>
                      <td></td>
                    </tr>
                    {/* row 5 */}
                    <tr>
                      <th>
                        <div className="flex items-center gap-3">
                          <div className="dui-avatar">
                            <div className="dui-mask dui-mask-squircle w-12 h-12">
                              <img
                                src="/assets/5.documentation.jpg"
                                alt="dui-avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              5. Final Documentation
                            </div>
                            <div className="text-sm opacity-50">
                              Upload guidelines
                            </div>
                          </div>
                        </div>
                      </th>

                      <td className="text-center">
                        Last Modified <br></br>
                        <span className="dui-badge dui-badge-sm bg-black text-white">
                          {formatDate(projectModificationDate.finalDocDate)}
                        </span>
                      </td>
                      {/* <td className="text-amber-300 text-center">
                        IN PROGRESS
                      </td> */}
                      <th>
                        <button
                          onClick={() => toggleModal("viewDoc")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "viewDoc" && (
                          <SupervisorPreviewDoc onClose={closeModal} />
                        )}
                      </th>
                      <th>
                        <button
                          onClick={() => toggleModal("setDoc")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "setDoc" && (
                          <SupervisorSetDoc onClose={closeModal} />
                        )}
                      </th>
                    </tr>
                    {/* row 6 */}
                    <tr>
                      <th>
                        <div className="flex items-center gap-3">
                          <div className="dui-avatar">
                            <div className="dui-mask dui-mask-squircle w-12 h-12">
                              <img
                                src="/assets/6.result&review.jpg"
                                alt="dui-avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">6. Result & Review</div>
                            <div className="text-sm opacity-50">
                              Review and evaluation
                            </div>
                          </div>
                        </div>
                      </th>

                      <td className="text-center">
                        Last Modified <br></br>
                        <span className="dui-badge dui-badge-sm bg-black text-white">
                          {formatDate(projectModificationDate.gradeDate)}
                        </span>
                      </td>
                      {/* <td className="text-gray-500 text-center">NOT STARTED</td> */}
                      <th>
                        <button
                          onClick={() => toggleModal("viewResult")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "viewResult" && (
                          <SupervisorPreviewResult onClose={closeModal} />
                        )}
                      </th>
                      <th>
                        <button
                          onClick={() => toggleModal("setResult")}
                          className="dui-btn bg-white bg-slate-200 hover:bg-white w-full flex items-center justify-center"
                        >
                          <FontAwesomeIcon
                            icon={faPencil}
                            className="text-black h-4 w-4"
                          />
                        </button>
                        {activeModal === "setResult" && (
                          <SupervisorSetResult onClose={closeModal} />
                        )}
                      </th>
                      <td></td>
                    </tr>
                    <tr></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.timelineMiddle6}>
              <h3 className="font-bold text-2xl mt-6 mb-3">
                Project Milestone
              </h3>
              <p>Have a look at student project miltestone!</p>

              <ul className="dui-steps my-6">
                <li className="dui-step">View Case Study</li>
                <li className="dui-step">Suggested Resources</li>
                <li className="dui-step">Proposal</li>
                <li className="dui-step">Project Planning</li>
                <li className="dui-step">Final Documnentation</li>
                <li className="dui-step">Result & Review</li>
              </ul>
            </div>
          </div>
          <Supervisor_Timeline_RightNav />
        </m.div>
      </Layout>
    </>
  );
}
