import React, { useEffect, useState } from "react";
import styles from "../../../../styles/Student_Timeline.module.css";
import modalStyles from "../../../../styles/Supervisor_Modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
import { motion as m } from "framer-motion";
import axios from "axios";

export default function SubmissionReviewForm({ proposalId, onClose }) {
  const [reviewStatus, setReviewStatus] = useState("");
  const [review, setReview] = useState("");

  useEffect(() => {
    // Ensure the element is present before calling showModal
    const modal = document.getElementById("my_modal_4");
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      console.error("Modal or showModal method not available");
    }
  }, []);

  const handleReset = () => {
    setReviewStatus("no submission");
    setReview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/edit-status/${proposalId}`,
        {
          reviewStatus,
          review,
        }
      );
      console.log("Response:", response.data);
      onClose(); // Close the modal on successful submission
    } catch (error) {
      console.error("Error updating proposal:", error);
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <dialog id="my_modal_4" className="dui-modal">
        <div className="dui-modal-box w-11/12 max-w-5xl max-h-11/12 flex flex-col justify-center items-center">
          <h3 className="font-bold text-2xl text-center mb-5">
            <FontAwesomeIcon className="w-6 h-6" icon={faSquarePollVertical} />
          </h3>
          <div style={{ maxWidth: "100%", overflowY: "auto" }}>
            <div>
              <div
                className="timeline-middle-3"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div
                  className="timeline-section-title text-center"
                  style={{ paddingBottom: "0", paddingTop: "0" }}
                >
                  GRADING & REVIEW
                </div>
                <div
                  className="timeline-section-title text-center"
                  style={{ paddingTop: "3px" }}
                >
                  <span className="mt-1 text-sm leading-6 text-gray-600 text-center">
                    This information will be displayed to project members.
                  </span>
                </div>
              </div>
              <div className="timeline-middle-3">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col justify-center items-center gap-x-5 mt-5">
                    <div className="flex flex-col justify-center  gap-y-5">
                      <div className="flex flex-row gap-3 items-center">
                        <input
                          type="radio"
                          value="approved"
                          name="SubmissionStatus"
                          onChange={(e) => setReviewStatus(e.target.value)}
                        />
                        <span>APPROVE</span>
                      </div>

                      <div className="flex flex-row gap-3 items-center">
                        <input
                          type="radio"
                          value="rejected"
                          name="SubmissionStatus"
                          onChange={(e) => setReviewStatus(e.target.value)}
                        />
                        <span>REJECT</span>
                      </div>

                      <div className="flex flex-row gap-3 items-center">
                        <input
                          type="radio"
                          value="no submission"
                          name="SubmissionStatus"
                          onChange={(e) => setReviewStatus(e.target.value)}
                        />
                        <span>RESET</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="space-y-12 mx-auto px-4"
                    style={{ width: "100%" }}
                  >
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="review"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Lecturer Review
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="review"
                              name="review"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="Type in submission review..."
                              value={review}
                              onChange={(e) => setReview(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-2">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={onClose}
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
