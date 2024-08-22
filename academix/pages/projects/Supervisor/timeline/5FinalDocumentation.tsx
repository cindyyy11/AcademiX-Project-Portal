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
import axios from "axios";
import { useRouter } from "next/router";

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

const Supervisor_Timeline_5FinalDocumentation: React.FC = () => {
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
      return statusOptions["no submission"];
    }
  );

  const [finalDoc, setFinalDoc] = useState<FinalDoc[]>([]);

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
    if (finalDoc[0]?.finalDocDetails.reviewStatus === "approved") {
      setFinalDocumentationCompleted(true);
    } else {
      setFinalDocumentationCompleted(false);
    }
  }, [finalDoc]);

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
            <p>
              {finalDoc[0]?.finalDocDetails.description}
            </p>
            <div className={styles.timelineMiddleX}>
              <a
                href={finalDoc[0]?.finalDocDetails.finalDocGuidelineFile}
                download="final-documentation-guideline"
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
                    {finalDoc[0]?.finalDocDetails.dueDate.split("T")[0]}
                  </span>
                </p>
              </div>
            </div>

            <form>
              <input
                type="text"
                name="finalDocSubmission"
                placeholder="Paste your link (Google Drive, OneDrive, etc.)"
                className="dui-input dui-input-bordered dui-input-primary w-full"
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

export default Supervisor_Timeline_5FinalDocumentation;
