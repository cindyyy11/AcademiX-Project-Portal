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

type FinalDocDetails = {
  title: string;
  description: string;
  dueDate: string;
  finalDocGuidelineFile?: string;
  status: string;
  reviewStatus?: string;
  review?: string;

  userId: string;
  finalDocSubmission?: string;

  createdAt: string;
  updatedAt: string;
};

type FinalDoc = {
  finalDocDetails: FinalDocDetails;
};

const Student_Timeline_5FinalDocumentation: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  const finalDocumentationKey = "final-documentation-completed";
  const finalDocumentationStatusKey = "final-documentation-status";

  const [finalDocumentationCompleted, setFinalDocumentationCompleted] =
    useState(() => {
      if (typeof window !== "undefined") {
        const savedState = localStorage.getItem(finalDocumentationKey);
        return savedState === "true";
      }
      return false; // Fallback for SSR
    });

  const [finalDocumentationStatus, setFinalDocumentationStatus] = useState(
    () => {
      if (typeof window !== "undefined") {
        const savedStatus = localStorage.getItem(finalDocumentationStatusKey);
        return savedStatus || statusOptions["no submission"];
      }
      return statusOptions["no submission"]; // Fallback for SSR
    }
  );

  const [files, setFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function selectFiles() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleFiles(selectedFiles: FileList) {
    const newFiles: { name: string; type: string; url: string }[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (!files.some((e) => e.name === file.name)) {
        newFiles.push({
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
        });
      }
    }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    return () => {
      newFiles.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }

  function onFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      handleFiles(selectedFiles);
    }
  }

  function deleteFile(index: number) {
    const fileToDelete = files[index];
    URL.revokeObjectURL(fileToDelete.url); // Clean up the object URL
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(true);
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length === 0) return;
    handleFiles(droppedFiles);
  }

  function uploadFiles() {
    console.log("Files: ", files);
  }

  useEffect(() => {
    localStorage.setItem(
      finalDocumentationKey,
      finalDocumentationCompleted.toString()
    );
    localStorage.setItem(finalDocumentationStatusKey, finalDocumentationStatus);
  }, [finalDocumentationCompleted, finalDocumentationStatus]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedValue = localStorage.getItem("finalDocumentationIsSubmitted");
  //     if (storedValue) {
  //       setFinalDocumentationIsSubmitted(JSON.parse(storedValue));
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem(
  //     "finalDocumentationIsSubmitted",
  //     JSON.stringify(finalDocumentationIsSubmitted)
  //   );
  // }, [finalDocumentationIsSubmitted]);

  // const [submissionDatetime, setSubmissionDatetime] = useState<Date | null>(
  //   () => {
  //     if (typeof window !== "undefined") {
  //       const savedDatetime = localStorage.getItem("submission-datetime");
  //       return savedDatetime ? new Date(savedDatetime) : null;
  //     }
  //     return null;
  //   }
  // );

  // const handleReset = () => {
  //   setFinalDocumentationCompleted(false);
  //   setFinalDocumentationStatus(statusOptions["no submission"]);
  //   setFiles([]);
  //   setFinalDocumentationIsSubmitted(false);
  //   localStorage.removeItem(finalDocumentationKey);
  //   localStorage.removeItem(finalDocumentationStatusKey);
  // };

  // const finalDocumentationApprovalMessage = "Great job guys, proceed!";
  // const finalDocumentationRejectionMessage =
  //   "Please check again the question requirement for introduction.";

  const people = [
    {
      name: "Justin Gilbert Alexius Silvester",
      email: "justin.gilbert@apu.edu.my",
      role: "Lecturer",
      imageUrl: "/assets/unknownUser.jpg",
    },
  ];

  const [finalDoc, setFinalDoc] = useState<FinalDoc[]>([]);
  const [formState, setFormState] = useState<FinalDoc[]>([]);
  const [finalDocumentationIsSubmitted, setFinalDocumentationIsSubmitted] =
    useState(false);

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
            finalDocSubmission:
              dataFinalDoc.finalDocDetails.finalDocSubmission || "",
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

  useEffect(() => {
    if (finalDoc[0]?.finalDocDetails.reviewStatus !== "no submission") {
      setFinalDocumentationIsSubmitted(true);
    } else {
      setFinalDocumentationIsSubmitted(false);
    }
  }, [finalDoc]);

  // Submit final documentation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    alert("Your final documentation is successfully submitted!!");
    // setFinalDocumentationIsSubmitted(true);
    // setFinalDocumentationStatus(statusOptions.PENDING_REVIEW);
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
        `http://localhost:8000/api/v1/submit-final-doc/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update final documentation");
      }

      const updatedFinalDoc = await response.json();
      console.log("Updated final documentation details:", updatedFinalDoc);
      setFinalDoc(updatedFinalDoc);
    } catch (error) {
      console.error("Failed to update final documentation details:", error);
    }
    fetchFinalDoc(id as string);
  };

  useEffect(() => {
    if (finalDoc[0]?.finalDocDetails.reviewStatus === "approved") {
      setFinalDocumentationCompleted(true);
    } else {
      setFinalDocumentationCompleted(false);
    }
  }, [finalDoc]);

  console.log("proposal status:", finalDoc[0]?.finalDocDetails.reviewStatus);

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
                  FINAL DOCUMENTATION
                  <StatusLabel
                    status={
                      (finalDoc[0]?.finalDocDetails.reviewStatus as
                        | "no submission"
                        | "pending review"
                        | "approved"
                        | "rejected") ?? "NO_SUBMISSION"
                    }
                  />
                </div>
                <button
                  className={`${styles.markAsCompletedBtn} ${
                    finalDocumentationCompleted ? styles.completed : ""
                  }`}
                  onClick={() =>
                    setFinalDocumentationCompleted(!finalDocumentationCompleted)
                  }
                >
                  Mark As Completed
                </button>
              </div>

              {/* <div className={styles.timelineMiddle4}>
                <button
                  className={styles.nextBtn}
                  onClick={() => {
                    setFinalDocumentationStatus(statusOptions.APPROVED);
                    setFinalDocumentationCompleted(true);
                  }}
                >
                  Approve
                </button>
                <button
                  className={styles.nextBtn}
                  onClick={() => {
                    setFinalDocumentationStatus(statusOptions.REJECTED);
                    setFinalDocumentationCompleted(false);
                  }}
                >
                  Reject
                </button>
                <button className={styles.nextBtn} onClick={handleReset}>
                  Reset
                </button>

                <div className={styles.timelineSectionDescription}>
                  Final Documentation is the ultimate resource for students to
                  prepare and submit their project reports. This page provides
                  detailed guidelines on compiling comprehensive and
                  professional documentation, including sections on
                  introduction, methodology, results, discussion, and
                  conclusions. It emphasizes the importance of clarity,
                  accuracy, and adherence to academic standards. Additionally,
                  it offers tips on formatting, referencing, and ensuring the
                  document is well-organized and polished. By following these
                  instructions, students can produce high-quality final
                  documentation that effectively showcases their project&apos;s
                  scope, execution, and findings, culminating in a successful
                  submission.
                </div>
              </div> */}

              <div className={styles.timelineMiddle6}>
                <h3 className="font-bold text-2xl mt-6 mb-3">
                  Title: {finalDoc[0]?.finalDocDetails.title}
                </h3>
                <p>{finalDoc[0]?.finalDocDetails.description}</p>
                <div className={styles.timelineMiddleX}>
                  <a
                    href={finalDoc[0]?.finalDocDetails.finalDocGuidelineFile}
                    download="final-documentation-guideline"
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

              {!finalDocumentationIsSubmitted ? (
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
                          {finalDoc[0]?.finalDocDetails.dueDate.split("T")[0]}
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
                        <span className={uploadStyles.select}>Drop files here</span>
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
                      name="finalDocSubmission"
                      placeholder="Paste your link (Google Drive, OneDrive, etc.)"
                      className="dui-input dui-input-bordered dui-input-primary w-full"
                      value={formState[0]?.finalDocDetails.finalDocSubmission} // Ensure the value is bound to formState
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
                    <strong>
                      {new Date(
                        finalDoc[0]?.finalDocDetails.updatedAt
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

              {finalDoc[0]?.finalDocDetails.reviewStatus === "approved" && (
                <div className={styles.timelineMiddle6}>
                  <h3 className="font-bold text-2xl mt-6 mb-3 text-center bg-green-200 pt-2 pb-2">
                    Approved !
                  </h3>
                  <p>
                    Congrats! Your final documentation is{" "}
                    <strong>APPROVED</strong>. Check the following comments
                    given by your supervisor.
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
                      {finalDoc[0]?.finalDocDetails.review}
                    </div>
                  </div>
                </div>
              )}

              {finalDoc[0]?.finalDocDetails.reviewStatus ===
                "pending review" && (
                <div className={styles.timelineMiddle6}>
                  <h3 className="font-bold text-2xl mt-6 mb-3 text-center bg-yellow-200 pt-2 pb-2">
                    Pending Review{" "}
                  </h3>
                  <p>
                    Currently, your final documentation is{" "}
                    <strong>PENDING REVIEW</strong> from your supervisor.
                    Results will be announced in 1-2 business days.
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

              {finalDoc[0]?.finalDocDetails.reviewStatus === "rejected" && (
                <div>
                  <div className={styles.timelineMiddle6}>
                    <h3 className="font-bold text-2xl mt-6 mb-3 text-center bg-red-200 pt-2 pb-2">
                      Rejected !
                    </h3>
                    <p>
                      Unfortunately, your final documentation is{" "}
                      <strong>REJECTED</strong>. Check the following advice
                      given by your supervisor.
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
                        {finalDoc[0]?.finalDocDetails.review}
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
                            {new Date(
                              finalDoc[0]?.finalDocDetails.updatedAt
                            ).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                              hour12: true,
                            })}
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
                        name="finalDocSubmission"
                        placeholder="Paste your link (Google Drive, OneDrive, etc.)"
                        className="dui-input dui-input-bordered dui-input-primary w-full"
                        value={
                          formState[0]?.finalDocDetails.finalDocGuidelineFile
                        } // Ensure the value is bound to formState
                        onChange={handleChange}
                      />
                      <div className={uploadStyles.submitBtnWrapper}>
                        <button
                          className={uploadStyles.submitBtn}
                          style={{ left: 0 }}
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className={styles.completeButtonWrapper}>
                <Link href="timeline-4project-planning">
                  <button className={styles.backBtn}>Back</button>
                </Link>
                <Link href="timeline-6result-&-review">
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

export default Student_Timeline_5FinalDocumentation;
