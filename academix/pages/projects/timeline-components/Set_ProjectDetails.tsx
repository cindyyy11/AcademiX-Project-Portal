import React, { useEffect, useState } from "react";
import styles from "../../../styles/Student_Timeline.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { motion as m } from "framer-motion";
import { useRouter } from "next/router";

type Props = {
  projectDetails: ProjectDetails;
  setProjectDetails: (projectDetails: ProjectDetails) => void;
  onClose: () => void;
};

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
  _id?: string; // Make _id optional
};

const SetProjectDetails: React.FC<Props> = ({
  projectDetails,
  setProjectDetails,
  onClose,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [formState, setFormState] = useState<ProjectDetails>(projectDetails);

  useEffect(() => {
    const modal = document.getElementById("my_modal_4");
    if (modal && typeof (modal as any).showModal === "function") {
      (modal as any).showModal();
    } else {
      console.error("Modal or showModal method not available");
    }
  }, []);

  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/edit-project-details/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );

      console.log("projectDetails:", response);
      if (!response.ok) {
        throw new Error("Failed to update project details");
      }

      const updatedProject = await response.json();
      setProjectDetails(updatedProject); // Update local state with updated project details
      console.log("Updated project details:", updatedProject);

      onClose(); // Close modal after successful update
    } catch (error) {
      alert("Failed to update project details. Please try again.");
      console.error("Failed to update project details:", error);
    }
  };
  console.log("formState:", formState);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <dialog id="my_modal_4" className="dui-modal">
        <div className="dui-modal-box w-11/12 max-w-5xl max-h-11/12 flex flex-col items-center">
          <h3 className="font-bold text-2xl text-center mb-5">
            <FontAwesomeIcon icon={faPencil} className="h-6 w-6" />
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
                  EDIT PROJECT DETAILS
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
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Project Name
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                              <input
                                type="text"
                                name="title"
                                id="title"
                                autoComplete="title"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Project Title"
                                value={formState.title}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor="supervisorId"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Supervisor ID
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                              <input
                                type="text"
                                name="supervisorId"
                                id="supervisorId"
                                autoComplete="title"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Project Title"
                                value={formState.supervisorId}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="about"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            About
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="about"
                              name="about"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              placeholder="About the project..."
                              value={formState.about}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="handOutDate"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Hand-Out Date
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                              <input
                                type="date"
                                name="handOutDate"
                                id="handOutDate"
                                autoComplete="handOutDate"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Hand-Out Date"
                                value={
                                  formState.handOutDate instanceof Date
                                    ? formState.handOutDate.toISOString().split("T")[0]
                                    : formState.handOutDate ?? '' // Use '' as fallback if formState.handOutDate is null or undefined
                                }
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="dueDate"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Due Date
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                              <input
                                type="date"
                                name="dueDate"
                                id="dueDate"
                                autoComplete="dueDate"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                placeholder="Due Date"
                                value={
                                  formState.dueDate instanceof Date
                                    ? formState.dueDate.toISOString().split("T")[0]
                                    : formState.dueDate ?? '' // Use '' as fallback if formState.dueDate is null or undefined
                                }
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-2">
                    <button
                      onClick={onClose}
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
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
};

export default SetProjectDetails;
