import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/Student_Timeline.module.css";
import modalStyles from "../../../styles/Supervisor_Modal.module.css";
import { motion as m } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePollVertical,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import Supervisor_Timeline_RightNav from "../timeline-components/Supervisor_Timeline_RightNav";

import SubmissionReviewForm from "./Review/ProposalSubmissionReviewForm";
import FinalDocSubmissionReviewForm from "./Review/FinalDocSubmissionReviewForm";
import Layout from "@/components/Layout";
import Supervisor_Timeline_Header from "../timeline-components/Supervisor_Timeline_Header";
import { useRouter } from "next/router";
import axios from "axios";

type ProposalDetails = {
  title: string;
  description: string;
  dueDate: string;
  proposalGuidelineFile?: string;
  status: string;
  reviewStatus?: string;
  review?: string;

  userId: string;
  proposalSubmission?: string;

  createdAt: string;
  updatedAt: string;
};

type Proposal = {
  proposalDetails: ProposalDetails;
};

type FinalDocDetails = {
  title: string;
  description: string;
  dueDate: string;
  finalDocGuidelineFile?: string;
  status: string;
  reviewStatus?: string;
  review?: string;

  userId: string;
  finalDocSubmission: string;

  createdAt: string;
  updatedAt: string;
};

type FinalDoc = {
  finalDocDetails: FinalDocDetails;
};

export default function Supervisor_Submission() {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  const [proposal, setProposal] = useState<Proposal[]>([]);
  const [finalDoc, setFinalDoc] = useState<FinalDoc[]>([]);

  //Get Proposal
  useEffect(() => {
    if (id) {
      fetchProposal(id as string);
    }
  }, [id]);

  async function fetchProposal(projectId: string) {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/get-proposal/${projectId}`
      );
      console.log("Fetched proposal:", response.data);

      const dataProposal = response.data;
      if (
        dataProposal &&
        dataProposal.success &&
        dataProposal.proposalDetails
      ) {
        const newProposal: Proposal = {
          proposalDetails: {
            title: dataProposal.proposalDetails.title || "",
            description: dataProposal.proposalDetails.description || "",
            dueDate: dataProposal.proposalDetails.dueDate || "",
            proposalGuidelineFile:
              dataProposal.proposalDetails.proposalGuidelineFile || "",
            status: dataProposal.proposalDetails.status || "",
            reviewStatus: dataProposal.proposalDetails.reviewStatus || "",
            review: dataProposal.proposalDetails.review || "",
            userId: dataProposal.proposalDetails.userId || "",
            proposalSubmission:
              dataProposal.proposalDetails.proposalSubmission || "",
            createdAt: dataProposal.proposalDetails.createdAt || "",
            updatedAt: dataProposal.proposalDetails.updatedAt || "",
          },
        };
        setProposal([newProposal]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  console.log("proposal:", proposal);

  useEffect(() => {
    if (id) {
      fetchFinalDoc(id as string);
    }
  }, [id]);

  async function fetchFinalDoc(id: string) {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/get-final-doc/${id}`
      );
      console.log("Fetched finalDoc:", response.data);

      const dataFinalDoc = response.data;
      if (
        dataFinalDoc &&
        dataFinalDoc.success &&
        dataFinalDoc.finalDocDetails
      ) {
        const newFinalDoc: FinalDoc = {
          finalDocDetails: {
            title: dataFinalDoc.finalDocDetails.title || "",
            description: dataFinalDoc.finalDocDetails.description || "",
            dueDate: dataFinalDoc.finalDocDetails.dueDate || "",
            finalDocGuidelineFile:
              dataFinalDoc.finalDocDetails.FinalDocGuidelineFile || "",
            status: dataFinalDoc.finalDocDetails.status || "",
            reviewStatus: dataFinalDoc.finalDocDetails.reviewStatus || "",
            review: dataFinalDoc.finalDocDetails.review || "",
            userId: dataFinalDoc.finalDocDetails.userId || "",
            finalDocSubmission: dataFinalDoc.finalDocDetails.FinalDocSubmission,
            createdAt: dataFinalDoc.finalDocDetails.createdAt || "",
            updatedAt: dataFinalDoc.finalDocDetails.updatedAt || "",
          },
        };
        setFinalDoc([newFinalDoc]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  console.log("finalDoc:", finalDoc);

  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const toggleModal = (modal: React.SetStateAction<string | null>) => {
    setActiveModal(activeModal === modal ? null : modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getStatusClass = (status: string | undefined) => {
    switch (status) {
      case "approved":
        return "bg-green-300";
      case "rejected":
        return "bg-red-300";
      case "pending review":
        return "bg-yellow-200";
      default:
        return "bg-gray-300";
    }
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
                STUDENT SUBMISSION
              </div>
            </div>
            <div className={styles.timelineMiddle4}>
              <div className={styles.timelineSectionDescription}>
                Student Submission - your central hub for overseeing and
                managing student submissions. Here, you can view a comprehensive
                table listing all student proposals and reports, providing a
                clear overview of each submission. You can efficiently review
                each student&apos;s work, choosing to either approve or reject
                submissions, and provide detailed feedback and reasons for
                rejections. This streamlined process helps maintain high
                standards, supports students in their academic progress, and
                ensures efficient oversight and timely feedback. With features
                like submission status tracking and search and filter options,
                managing and reviewing student work has never been easier.
              </div>
            </div>

            {/* Proposal Submission */}
            <div className={`${styles.timelineMiddle4} bg-white pt-3 pb-10`}>
              {proposal.length === 0 ||
              !proposal[0].proposalDetails.proposalSubmission ? (
                <div className="mt-10 flex flex-col items-center justify-center">
                  <h1 className="text-lg">PROPOSAL</h1>
                  <p className="text-center text-gray-500 pb-4">
                    Currently no proposal submission...
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="dui-table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>Proposal</th>
                        <th className="text-center">Student</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Review</th>
                        <th className="text-center">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposal.map((proposal) => (
                        <tr key={proposal.proposalDetails.userId}>
                          <td className="w-64">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-bold w-4/5 overflow-hidden">
                                  {proposal.proposalDetails.proposalSubmission}
                                </div>
                                <div className="text-sm opacity-50">
                                  {new Date(
                                    proposal.proposalDetails.updatedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="flex items-center justify-center">
                            <div className="dui-avatar dui-online">
                              <div className="w-12 h-12 rounded-full">
                                <img
                                  src="/assets/unknownUser.jpg"
                                />
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <span
                              className={`dui-badge dui-badge-m ${
                                getStatusClass(proposal.proposalDetails?.reviewStatus)
                              } text-black`}
                            >
                              {proposal.proposalDetails?.reviewStatus?.toUpperCase()}
                            </span>
                            <br></br>
                            <span className="text-gray-400 text-end">
                              {new Date(
                                proposal.proposalDetails?.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => toggleModal("submissionReview")}
                              className="dui-btn bg-slate-200 hover:bg-white w-full"
                            >
                              <FontAwesomeIcon
                                className="h-5 w-5"
                                icon={faSquarePollVertical}
                              />
                            </button>
                            {activeModal === "submissionReview" && (
                              <SubmissionReviewForm
                                onClose={closeModal}
                                proposalId={id as string}
                              />
                            )}
                          </td>
                          <td>
                            <a
                              href={
                                proposal.proposalDetails?.proposalSubmission
                              }
                              className="dui-btn bg-slate-200 hover:bg-white w-full"
                              target="_blank"
                            >
                              <FontAwesomeIcon
                                className="h-5 w-5"
                                icon={faDownload}
                              />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Final Documentation Submission */}
            <div className={`${styles.timelineMiddle4} bg-white pt-3 pb-10`}>
              {finalDoc.length === 0 ||
              !finalDoc[0].finalDocDetails.finalDocSubmission ? (
                <div className="mt-10 flex flex-col items-center justify-center">
                  <h1 className="text-lg">FINAL DOCUMENTATION</h1>
                  <p className="text-center text-gray-500 pb-4">
                    Currently no final documentation submission...
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="dui-table">
                    {/* head */}
                    <thead>
                      <tr>
                        <th>Final Documentation</th>
                        <th className="text-center">Student</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Review</th>
                        <th className="text-center">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {finalDoc.map((finalDoc) => (
                        <tr key={finalDoc.finalDocDetails.userId}>
                          <td className="w-64">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-bold w-4/5 overflow-hidden">
                                  {finalDoc.finalDocDetails.finalDocSubmission}
                                </div>
                                <div className="text-sm opacity-50">
                                  {new Date(
                                    finalDoc.finalDocDetails.updatedAt
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="flex items-center justify-center">
                            <div className="dui-avatar dui-online">
                              <div className="w-12 h-12 rounded-full">
                                <img
                                  src="/assets/unknownUser.jpg"
                                />
                              </div>
                            </div>
                            {finalDoc.finalDocDetails.userId}
                          </td>
                          <td className="text-center">
                            <span
                              className={`dui-badge dui-badge-m ${
                                getStatusClass(finalDoc.finalDocDetails?.reviewStatus)
                              } text-black`}
                            >
                              {finalDoc.finalDocDetails?.reviewStatus?.toUpperCase()}
                            </span>
                            <br></br>
                            <span className="text-gray-400 text-end">
                              {new Date(
                                finalDoc.finalDocDetails?.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => toggleModal("submissionReview1")}
                              className="dui-btn bg-slate-200 hover:bg-white w-full"
                            >
                              <FontAwesomeIcon
                                className="h-5 w-5"
                                icon={faSquarePollVertical}
                              />
                            </button>
                            {activeModal === "submissionReview1" && (
                              <FinalDocSubmissionReviewForm
                                onClose={closeModal}
                                finalDocId={id as string}
                              />
                            )}
                          </td>
                          <td>
                            <a
                              href={
                                finalDoc.finalDocDetails?.finalDocSubmission
                              }
                              className="dui-btn bg-slate-200 hover:bg-white w-full"
                              target="_blank"
                            >
                              <FontAwesomeIcon
                                className="h-5 w-5"
                                icon={faDownload}
                              />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          <Supervisor_Timeline_RightNav />
        </m.div>
      </Layout>
    </>
  );
}
