/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useRef } from "react";
import styles from "../../../styles/Student_Timeline.module.css";
import uploadStyles from "../../../styles/Upload_Button.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import Project_Timeline_RightNav from "../timeline-components/Project_Timeline_RightNav";
import { motion as m } from "framer-motion";
import {
  StatusLabel,
  statusOptions,
} from "../timeline-components/Status_Label";
import Layout from "@/components/Layout";
import Student_Timeline_Header from "../timeline-components/Student_Timeline_Header";
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

const Student_Timeline_3Proposal: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  const proposalKey = "proposal-completed";
  const proposalStatusKey = "proposal-status";

  const [proposalCompleted, setProposalCompleted] = useState(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem(proposalKey);
      return savedState === "true";
    }
    return false; // Fallback for SSR
  });

  const [proposalStatus, setProposalStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const savedStatus = localStorage.getItem(proposalStatusKey);
      return savedStatus || statusOptions["no submission"];
    }
    return statusOptions["no submission"]; // Fallback for SSR
  });

  // const [files, setFiles] = useState<any[]>([]);
  // const [isDragging, setIsDragging] = useState(false);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // function selectFiles() {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // }

  // function handleFiles(selectedFiles: FileList | null) {
  //   const newFiles: { name: string; type: string; url: string }[] = [];
  //   if (selectedFiles) {
  //     for (let i = 0; i < selectedFiles.length; i++) {
  //       const file = selectedFiles[i];
  //       if (!files.some((e) => e.name === file.name)) {
  //         newFiles.push({
  //           name: file.name,
  //           type: file.type,
  //           url: URL.createObjectURL(file),
  //         });
  //       }
  //     }
  //     setFiles((prevFiles) => [...prevFiles, ...newFiles]);

  //     return () => {
  //       newFiles.forEach((file) => URL.revokeObjectURL(file.url));
  //     };
  //   }
  // }

  // function onFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
  //   const selectedFiles = event.target.files;
  //   if (selectedFiles) {
  //     handleFiles(selectedFiles);
  //   }
  // }

  // function deleteFile(index: number) {
  //   const fileToDelete = files[index];
  //   URL.revokeObjectURL(fileToDelete.url); // Clean up the object URL
  //   setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  // }

  // function onDragOver(event: React.DragEvent<HTMLDivElement>) {
  //   event.preventDefault();
  //   setIsDragging(true);
  //   event.dataTransfer.dropEffect = "copy";
  // }

  // function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
  //   event.preventDefault();
  //   setIsDragging(false);
  // }

  // function onDrop(event: React.DragEvent<HTMLDivElement>) {
  //   event.preventDefault();
  //   setIsDragging(false);
  //   const droppedFiles = event.dataTransfer.files;
  //   if (droppedFiles) {
  //     handleFiles(droppedFiles);
  //   }
  // }

  async function uploadFiles(files: FileList | File[], projectId: string) {
    if (!files || files.length === 0) {
      alert("Please select files first!");
      return;
    }

    const formData = new FormData();
    // Convert FileList to array if needed
    const filesArray = Array.from(files);

    filesArray.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/submit-proposal/${projectId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed!");
      }

      const result = await response.json();

      // Handle response as needed (e.g., update UI)
      console.log("File upload successful:", result);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("File upload failed!");
    }
  }

  useEffect(() => {
    localStorage.setItem(proposalKey, proposalCompleted.toString());
    localStorage.setItem(proposalStatusKey, proposalStatus);
  }, [proposalCompleted, proposalStatus]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedValue = localStorage.getItem("proposalIsSubmitted");
  //     if (storedValue) {
  //       setProposalIsSubmitted(JSON.parse(storedValue));
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem(
  //       "proposalIsSubmitted",
  //       JSON.stringify(proposalIsSubmitted)
  //     );
  //   }
  // }, [proposalIsSubmitted]);

  // const [submissionDatetime, setSubmissionDatetime] = useState<Date | null>(
  //   () => {
  //     if (typeof window !== "undefined") {
  //       const savedDatetime = localStorage.getItem("submission-datetime");
  //       return savedDatetime ? new Date(savedDatetime) : null;
  //     }
  //     return null;
  //   }
  // );

  const handleReset = () => {
    setProposalCompleted(false);
    setProposalStatus(statusOptions["no submission"]);
    // setFiles([]);
    // setProposalIsSubmitted(false);
    localStorage.removeItem(proposalKey);
    localStorage.removeItem(proposalStatusKey);
  };

  // const proposalApprovalMessage = "Great job guys, proceed!";
  // const proposalRejectionMessage =
  //   "Please check again the question requirement for introduction.";

  const people = [
    {
      name: "Justin Gilbert Alexius Silvester",
      email: "justin.gilbert@apu.edu.my",
      role: "Lecturer",
      imageUrl: "/assets/unknownUser.jpg",
    },
  ];

  const [proposal, setProposal] = useState<Proposal[]>([]);
  const [formState, setFormState] = useState<Proposal[]>([]);

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

  // console.log("proposal:", proposal);


  const [proposalIsSubmitted, setProposalIsSubmitted] = useState(false);

  useEffect(() => {
    if (proposal[0]?.proposalDetails.reviewStatus !== "no submission") {
      setProposalIsSubmitted(true);
    } else {
      setProposalIsSubmitted(false);
    }
  }, [proposal]);

  // Submit Proposal
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    alert("Your proposal is successfully submitted!!");
    // setProposalIsSubmitted(true);
    // setProposalStatus(statusOptions["pending review"]);
    // setSubmissionDatetime(now);

    // const existingSubmissions = JSON.parse(
    //   localStorage.getItem("submission-dates") || "[]"
    // );
    // const updatedSubmissions = [...existingSubmissions, now.toString()];
    // localStorage.setItem(
    //   "submission-dates",
    //   JSON.stringify(updatedSubmissions)
    // );

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/submit-proposal/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update proposal details");
      }

      const updatedProposal = await response.json();
      console.log("Updated proposal details:", updatedProposal);
      setProposal(updatedProposal);
    } catch (error) {
      console.error("Failed to update project details:", error);
    }
    fetchProposal(id as string);
  };

  useEffect(() => {
    if (proposal[0]?.proposalDetails.reviewStatus === "approved") {
      setProposalCompleted(true);
    } else {
      setProposalCompleted(false);
    }
  }, [proposal]);

  console.log("proposal status:", proposal[0]?.proposalDetails.reviewStatus);

  return (
    <>
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
                <h3 className="font-bold text-2xl mt-6 mb-3">
                  Title: {proposal[0]?.proposalDetails.title}
                </h3>
                <p>{proposal[0]?.proposalDetails.description}</p>
                <div className={styles.timelineMiddleX}>
                  <a
                    href={proposal[0]?.proposalDetails.proposalGuidelineFile}
                    download="proposal"
                    className={styles.downloadBtn}
                    target="_blank"
                  >
                    Download&nbsp;
                    <FontAwesomeIcon
                      icon={faDownload}
                      className={styles.icon}
                    />
                  </a>
                </div>
              </div>

              {!proposalIsSubmitted ? (
                <div className={styles.timelineMiddle6}>
                  <h3 className="font-bold text-2xl mt-6 mb-3">Submission</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolore, in, accusamus, repudiandae quae iure debitis animi
                    quisquam labore ab itaque suscipit. Perspiciatis iste ut
                    excepturi amet magnam atque repellat rem.
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

                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="proposalSubmission"
                      placeholder="Paste your link (Google Drive, OneDrive, etc.)"
                      className="dui-input dui-input-bordered dui-input-primary w-full"
                      value={formState[0]?.proposalDetails.proposalSubmission} // Ensure the value is bound to formState
                      onChange={handleChange}
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
              ) : (
                <div className={styles.timelineMiddle6}>
                  <h3 className="font-bold text-2xl mt-6 mb-3">Submission</h3>
                  <p>
                    Your file was submitted on{" "}
                    {/* <strong>{proposal[0]?.proposalDetails.updatedAt}</strong> */}
                    <strong>
                      {new Date(
                        proposal[0]?.proposalDetails.updatedAt
                      ).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                      })}
                    </strong>
                    .
                  </p>
                </div>
              )}

              {proposal[0]?.proposalDetails.reviewStatus === "approved" && (
                <div className={styles.timelineMiddle6}>
                  <h3 className="font-bold text-2xl mt-6 mb-3 text-center bg-green-200 pt-2 pb-2">
                    Approved !
                  </h3>
                  <p>
                    Congrats! Your proposal is <strong>APPROVED</strong>. Check
                    the following comments given by your supervisor.
                  </p>
                  <h3 className="font-medium text-xl mt-6 mb-3 underline underline-offset-8">
                    Supervisor Comments
                  </h3>
                  <div className="dui-chat dui-chat-start mt-5">
                    <div className="dui-chat-image avatar">
                      <div className="w-10 rounded-full">
                        {people.map((person, index) => (
                          <img
                            key={index}
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                            src={person.imageUrl}
                            alt=""
                          />
                        ))}
                      </div>
                    </div>
                    <div
                      className="dui-chat-bubble"
                      style={{ backgroundColor: "black" }}
                    >
                      {proposal[0]?.proposalDetails.review}
                    </div>
                  </div>
                </div>
              )}

              {proposal[0]?.proposalDetails.reviewStatus === "pending review" && (
                <div className={styles.timelineMiddle6}>
                  <h3 className="font-bold text-2xl mt-6 mb-3 text-center bg-yellow-200 pt-2 pb-2">
                    Pending Review{" "}
                  </h3>
                  <p>
                    Currently, your proposal is <strong>PENDING REVIEW</strong>{" "}
                    from your supervisor. Results will be announced in 1-2
                    business days.
                  </p>

                  <div className="dui-chat dui-chat-start mt-5">
                    <div className="dui-chat-image avatar">
                      <div className="w-10 rounded-full">
                        {people.map((person, index) => (
                          <img
                            key={index}
                            className="h-12 w-12 flex-none rounded-full bg-gray-50"
                            src={person.imageUrl}
                            alt=""
                          />
                        ))}
                      </div>
                    </div>
                    <div
                      className="dui-chat-bubble"
                      style={{ backgroundColor: "black" }}
                    >
                      Wait lah! Don&apos;t worry.
                    </div>
                  </div>
                  <progress className="dui-progress w-56 mt-2"></progress>
                </div>
              )}

              {proposal[0]?.proposalDetails.reviewStatus === "rejected" && (
                <div>
                  <div className={styles.timelineMiddle6}>
                    <h3 className="font-bold text-2xl mt-6 mb-3 text-center bg-red-200 pt-2 pb-2">
                      Rejected !
                    </h3>
                    <p>
                      Unfortunately, your proposal is <strong>REJECTED</strong>.
                      Check the following advice given by your supervisor.
                    </p>
                    <h3 className="font-medium text-xl mt-6 mb-3 underline underline-offset-8">
                      Supervisor Advice
                    </h3>
                    <div className="dui-chat dui-chat-start mt-5">
                      <div className="dui-chat-image avatar">
                        <div className="w-10 rounded-full">
                          {people.map((person, index) => (
                            <img
                              key={index}
                              className="h-12 w-12 flex-none rounded-full bg-gray-50"
                              src={person.imageUrl}
                              alt=""
                            />
                          ))}
                        </div>
                      </div>
                      <div
                        className="dui-chat-bubble"
                        style={{ backgroundColor: "black" }}
                      >
                        {proposal[0]?.proposalDetails.review}
                      </div>
                    </div>
                  </div>

                  <div className={styles.timelineMiddle6}>
                    <h3 className="font-bold text-2xl mt-6 mb-3">
                      Submit Again
                    </h3>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolore, in, accusamus, repudiandae quae iure debitis animi
                      quisquam labore ab itaque suscipit. Perspiciatis iste ut
                      excepturi amet magnam atque repellat rem.
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
                    </div>

                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        name="proposalSubmission"
                        placeholder="Paste your link (Google Drive, OneDrive, etc.)"
                        className="dui-input dui-input-bordered dui-input-primary w-full"
                        value={formState[0]?.proposalDetails.proposalSubmission} // Ensure the value is bound to formState
                        onChange={handleChange}
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
                </div>
              )}

              <div className={styles.completeButtonWrapper}>
                <Link
                  href={`/projects/Student/timeline-2suggested-resource/?id=${id}`}
                >
                  <button className={styles.backBtn}>Back</button>
                </Link>
                <Link
                  href={`/projects/Student/timeline-4project-planning/?id=${id}`}
                >
                  <button className={styles.nextBtn}>Next</button>
                </Link>
              </div>
            </m.div>
            <Project_Timeline_RightNav />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Student_Timeline_3Proposal;
