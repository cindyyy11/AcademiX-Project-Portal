import React, { useEffect, useState } from "react";
import styles from "../../../../styles/Student_Timeline.module.css";
import modalStyles from "../../../../styles/Supervisor_Modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { motion as m } from "framer-motion";
import { useRouter } from "next/router";

type grade = {
  resultTranscripts?: string;
  proposalMarks: number;
  finalDocumentationMarks: number;
  programImplementationMarks: number;
  overallReview: string;
};

const initialGradeState: grade = {
  resultTranscripts: "",
  proposalMarks: 0,
  finalDocumentationMarks: 0,
  programImplementationMarks: 0,
  overallReview: "",
};

export default function SupervisorSetResult() {
  const [grade, setGrade] = useState<grade>(initialGradeState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  useEffect(() => {
    const modal = document.getElementById("my_modal_4") as HTMLDialogElement;
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      console.error("Modal or showModal method not available");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGrade({ ...grade, [name]: value });

    // Remove error for the current field if it has a value
    if (value.trim() !== "") {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  console.log("grade:", grade);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/create-grade/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(grade),
        }
      );
      if (response.ok) {
        alert("Grade set successfully");
      } else {
        alert("Failed to set grade");
      }
      const updatedGrade = await response.json();
      setGrade(updatedGrade);
      alert("Grade updated successfully");
      onClose();
    } catch (error) {
      console.error("Failed to set grade:", error);
    }
  };

  const onClose = () => {
    const modal = document.getElementById("my_modal_4") as HTMLDialogElement;
    if (modal && typeof modal.close === "function") {
      modal.close();
    } else {
      console.error("Modal or close method not available");
    }
  };


  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <dialog id="my_modal_4" className="dui-modal">
        <div className="dui-modal-box w-11/12 max-w-5xl max-h-11/12 flex flex-col items-center">
          <h3 className="font-bold text-2xl text-center mb-5">
            <FontAwesomeIcon
              icon={faPencil}
              className="h-5 w-5
          "
            />
          </h3>
          <div style={{ maxWidth: "100%", overflowY: "auto" }}>
            <div>
              <div
                className={styles.timelineMiddle3}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div
                  className={`${styles.timelineSectionTitle} text-center`}
                  style={{ paddingBottom: "0", paddingTop: "0" }}
                >
                  RESULT & REVIEW
                </div>
                <div
                  className={`${styles.timelineSectionTitle} text-center`}
                  style={{ paddingTop: "3px" }}
                >
                  <span className="mt-1 text-sm leading-6 text-gray-600 text-center">
                    This information will be displayed to project members.
                  </span>
                </div>
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <div
                    className="space-y-12 mx-auto px-4"
                    style={{ width: "100%" }}
                  >
                    <div className="border-b border-gray-900/10 pb-12 ">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
                        <div className="col-span-full">
                          <label
                            htmlFor="proposalMarks"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Proposal Marks
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                              <input
                                type="number"
                                name="proposalMarks"
                                id="proposalMarks"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="proposal-marks"
                                onChange={handleChange}
                                required
                                value={grade.proposalMarks}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor="finalDocumentationMarks"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Final Documentation Marks
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                              <input
                                type="number"
                                name="finalDocumentationMarks"
                                id="finalDocumentationMarks"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="final-doc-marks"
                                onChange={handleChange}
                                required
                                value={grade.finalDocumentationMarks}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor="programImplementationMarks"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Program Implementation Marks
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                              <input
                                type="number"
                                name="programImplementationMarks"
                                id="programImplementationMarks"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="program-implementation-marks"
                                onChange={handleChange}
                                required
                                value={grade.programImplementationMarks}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="overallReview"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Overall Review
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="overallReview"
                              name="overallReview"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="Type in project overall review..."
                              onChange={handleChange}
                              required
                              value={grade.overallReview}
                            />
                          </div>
                        </div>
                        <div className="col-span-full mb-1">
                          <label
                            htmlFor="resultTranscripts"
                            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                          >
                            Upload Result Transcripts
                          </label>
                          <input
                            type="text"
                            name="resultTranscripts"
                            placeholder="Paste your link (Google Drive, OneDrive, etc.)"
                            className="dui-input dui-input-bordered dui-input-primary w-full"
                            value={grade.resultTranscripts} // Ensure the value is bound to formState
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-row items-center justify-end gap-x-2">
                    <button
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={onClose}
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </m.div>
  );
}
