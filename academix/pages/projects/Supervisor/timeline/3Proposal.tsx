import React, { useState, useEffect, useRef } from "react";
import styles from "../../../../styles/Student_Timeline.module.css";
import uploadStyles from "../../../../styles/Upload_Button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { motion as m } from "framer-motion";
import {
  StatusLabel,
  statusOptions,
} from "../../timeline-components/Status_Label";
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

const Supervisor_Timeline_3Proposal: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  const proposalKey = "proposal-completed";
  const proposalStatus = statusOptions["no submission"];

  const [proposalCompleted, setProposalCompleted] = useState(() => {
    const savedState = localStorage.getItem(proposalKey);
    return savedState === "true";
  });

  const [proposal, setProposal] = useState<Proposal[]>([]);
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
    if (proposal[0]?.proposalDetails.reviewStatus === "approved") {
      setProposalCompleted(true);
    } else {
      setProposalCompleted(false);
    }
  }, [proposal]);

  if (!proposal) {
    return <div>Loading...</div>;
  }

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
            <div className={styles.timelineSectionTitle}>
              PROPOSAL
              <StatusLabel
                    status={
                      (proposal[0]?.proposalDetails.reviewStatus as
                        | "no submission"
                        | "pending review"
                        | "approved"
                        | "rejected") ?? "NO_SUBMISSION"
                    }
                  />
            </div>

            <button
              className={`${styles.markAsCompletedBtn} ${
                proposalCompleted ? styles.completed : ""
              }`}
              onClick={() => setProposalCompleted(!proposalCompleted)}
            >
              Mark As Complete
            </button>
          </div>

          {/* Control buttons */}
          {/* <div className={styles.timelineMiddle4}>
                <button
                  className={styles.nextBtn}
                  onClick={() => {
                    setProposalStatus(statusOptions.APPROVED);
                    setProposalCompleted(true);
                  }}
                >
                  Approve
                </button>
                <button
                  className={styles.nextBtn}
                  onClick={() => {
                    setProposalStatus(statusOptions.REJECTED);
                    setProposalCompleted(false);
                  }}
                >
                  Reject
                </button>
                <button className={styles.nextBtn} onClick={handleReset}>
                  Reset
                </button>
                <div className={styles.timelineSectionDescription}>
                  Proposal serves as a crucial guide for students, outlining the
                  specific content requirements they need to include in their
                  project proposals. This page provides detailed instructions
                  and criteria to ensure that students understand the
                  expectations and can structure their proposals effectively. It
                  includes sections such as the project title, objectives,
                  methodology, timeline, and expected outcomes. By clearly
                  delineating each component, the Proposal Page helps students
                  organize their thoughts, conduct thorough research, and
                  present a coherent and comprehensive plan for their projects.
                  This resource is designed to assist students in crafting
                  proposals that are both compelling and aligned with academic
                  standards, thereby laying a strong foundation for the
                  successful execution of their projects.
                </div>
              </div> */}

          <div className={styles.timelineMiddle6}>
            <h3 className="font-bold text-2xl mt-6 mb-3">Title: {proposal[0]?.proposalDetails.title}</h3>
            <p>
              {proposal[0]?.proposalDetails.description}
            </p>
            <div className={styles.timelineMiddleX}>
              <a
                href={proposal[0]?.proposalDetails.proposalGuidelineFile}
                download="proposal"
                className={styles.downloadBtn}
                target="_blank"
              >
                Download&nbsp;
                <FontAwesomeIcon icon={faDownload} className={styles.icon} />
              </a>
            </div>
          </div>

          <div className={styles.timelineMiddle6}>
            <h3 className="font-bold text-2xl mt-6 mb-3">Submission</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore,
              in, accusamus, repudiandae quae iure debitis animi quisquam labore
              ab itaque suscipit. Perspiciatis iste ut excepturi amet magnam
              atque repellat rem.
            </p>

            <div className={uploadStyles.uploadCard}>
              <div className={uploadStyles.uploadTop}>
                <p>
                  Due on{" "}
                  <span>
                    {proposal[0]?.proposalDetails.dueDate.split("T")[0]}
                  </span>
                </p>
              </div>
            </div>
            {/* <div
                        className={uploadStyles.dragArea}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                      >
                        {isDragging ? (
                          <span className={uploadStyles.select}>
                            Drop files here
                          </span>
                        ) : (
                          <>
                            Drag & Drop files here or{" "}
                            <span
                              className={uploadStyles.browse}
                              role="button"
                              onClick={selectFiles}
                            >
                              Browse
                            </span>
                          </>
                        )}
                        <input
                          name="file"
                          type="file"
                          className={uploadStyles.file}
                          multiple
                          ref={fileInputRef}
                          onChange={onFileSelect}
                        />
                      </div>
                      <div className={uploadStyles.container}>
                        {files.map((file, index) => (
                          <div className={uploadStyles.file} key={index}>
                            <span
                              className={uploadStyles.delete}
                              onClick={() => deleteFile(index)}
                            >
                              &times;
                            </span>
                            {file.type.startsWith("image/") ? (
                              <img src={file.url} alt={file.name} />
                            ) : (
                              <p>{file.name}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={uploadFiles}>
                        Upload
                      </button> */}

            <form>
              <input
                type="text"
                name="proposalSubmission"
                placeholder="Paste your link (Google Drive, OneDrive, etc.)"
                className="dui-input dui-input-bordered dui-input-primary w-full" // Ensure the value is bound to formState
              />
              <div className={uploadStyles.submitBtnWrapper}>
                <button
                  type="submit"
                  className={uploadStyles.submitBtn}
                  style={{ left: 0 }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </m.div>
      </div>
    </>
  );
};
export default Supervisor_Timeline_3Proposal;
