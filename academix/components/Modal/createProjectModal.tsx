import React, { useEffect, useState } from "react";
import styles from "../../styles/Student_Timeline.module.css";
import { motion as m } from "framer-motion";
import Icon from "../Icon";
import axios from "axios";

type Supervisor = {
  _id: string;
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
  categories: string; // Add categories field
  _id?: string; // Make _id optional
};


type Props = {
  onClose: () => void;
};

const CreateProjectModal: React.FC<Props> = ({ onClose }) => {
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    title: "",
    about: "",
    objective: "",
    categories: "",
    handOutDate: null,
    dueDate: null,
    supervisor: null,
    supervisorId: "",
    members: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProjectDetails({ ...projectDetails, [name]: value });
  };

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/get-supervisors"
        );
        setSupervisors(response.data.supervisors);
      } catch (error) {
        console.error("Failed to fetch supervisors", error);
      }
    };

    fetchSupervisors();
  }, []);
  console.log("supervisors: ", supervisors);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the project
      const response = await fetch(
        `http://localhost:8000/api/v1/create-project-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project details");
      }

      const newProject = await response.json();
      const projectId = newProject._id; // Assuming the backend returns the project ID

      // Create related content (e.g., case study) with default values

      setProjectDetails(newProject);
      onClose();
    } catch (error) {
      alert("Failed to create project details. Please try again.");
      console.error("Failed to create project details:", error);
    }
  };

  useEffect(() => {
    const modal = document.getElementById("my_modal_4");
    if (modal && typeof (modal as any).showModal === "function") {
      (modal as any).showModal();
    } else {
      console.error("Modal or showModal method not available");
    }
  }, []);

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      <dialog id="my_modal_4" className="dui-modal">
        <div className="dui-modal-box w-2/4 max-w-5xl max-h-11/12">
          <h3 className="font-bold text-2xl text-center mb-5">
            <Icon name="plus" className="w-6 h-6" />
          </h3>
          <div style={{ maxWidth: "100%", overflowY: "auto" }}>
            <div className="px-10">
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
                  CREATE PROJECT DETAILS
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
                        <div className="sm:col-span-4">
                          <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Project Details
                          </h2>
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Project Title
                          </label>
                          <div className="mt-2">
                            <input
                              id="title"
                              name="title"
                              type="text"
                              autoComplete="title"
                              value={projectDetails.title}
                              onChange={handleChange}
                              required
                              placeholder="New Project"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="categories"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Categories
                          </label>
                          <div className="mt-2">
                            <input
                              id="categories"
                              name="categories"
                              type="text"
                              autoComplete="categories"
                              value={projectDetails.categories}
                              onChange={handleChange}
                              required
                              placeholder="New Project"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
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
                              value={projectDetails.about}
                              onChange={handleChange}
                              placeholder="It is about..."
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            ></textarea>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write a few sentences about the project.
                          </p>
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor="objective"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Objective
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="objective"
                              name="objective"
                              rows={3}
                              value={projectDetails.objective}
                              onChange={handleChange}
                              placeholder="The main purpose is..."
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            ></textarea>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write the objectives of the project.
                          </p>
                        </div>
                        <div className="sm:col-span-4">
                          <label htmlFor="supervisorId" className="block text-sm font-medium leading-6 text-gray-900">Supervisor</label><br></br>
                          <select
                            id="supervisorId"
                            name="supervisorId"
                            value={projectDetails.supervisorId}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select a supervisor</option>
                            {supervisors.map((supervisor) => (
                              <option
                                key={supervisor._id}
                                value={supervisor._id}
                              >
                                {supervisor.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="handOutDate"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Handout Date
                          </label>
                          <div className="mt-2">
                            <input
                              id="handOutDate"
                              name="handOutDate"
                              type="date"
                              value={
                                projectDetails.handOutDate
                                  ? projectDetails.handOutDate
                                      .toString()
                                      .slice(0, 10)
                                  : ""
                              }
                              onChange={handleChange}
                              autoComplete="handOutDate"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="dueDate"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Due Date
                          </label>
                          <div className="mt-2">
                            <input
                              id="dueDate"
                              name="dueDate"
                              type="date"
                              value={
                                projectDetails.dueDate
                                  ? projectDetails.dueDate
                                      .toString()
                                      .slice(0, 10)
                                  : ""
                              }
                              onChange={handleChange}
                              autoComplete="dueDate"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        type="button"
                        className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <form method="dialog" className="dui-modal-backdrop">
            <button onClick={onClose}>close</button>
          </form>
        </div>
      </dialog>
    </m.div>
  );
};

export default CreateProjectModal;
