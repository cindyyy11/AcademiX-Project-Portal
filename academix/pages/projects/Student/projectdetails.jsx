'use client';
import React, { useState , useEffect } from "react";
import styles from "../../../styles/Student_Timeline.module.css";
import { motion as m } from "framer-motion";
import Layout from "@/components/Layout";
import Student_Timeline_Header from "../timeline-components/Student_Timeline_Header";
import { format } from "date-fns"; // Import date formatting function if not already imported
import { useRouter } from "next/router";

export default function StudentProject_Details() {
  const router = useRouter();
  const { id } = router.query;

  const [projectDetails, setProjectDetails] = useState({
    title: "",
    about: "",
    objective: "",
    handOutDate: null,
    dueDate: null,
    supervisor: null,
    supervisorId: "",
    members: [],
  });

  // Fetch initial project details from the backend
  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/get-single-project/${id}`
        );
        const data = await response.json();
        console.log("Fetched project details:", data); // Log the fetched data

        const {
          title,
          about,
          objective,
          handOutDate,
          dueDate,
          supervisor,
          supervisorId,
          members,
        } = data.projectDetails;

        setProjectDetails({
          title: title || "",
          about: about || "",
          objective: objective || "",
          handOutDate: handOutDate ? new Date(handOutDate) : null,
          dueDate: dueDate ? new Date(dueDate) : null,
          supervisor: supervisor || null,
          supervisorId: supervisorId || "",
          members: members || [],
        });
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    }

    fetchProjectDetails();
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  return (
    <>
      <Layout>
        <Student_Timeline_Header />
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className={styles.timelineMiddle}
        >
          <div className="p-16 bg-white">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                Project Details
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Project details and supervisor in charge.
              </p>
            </div>
            <div className="mt-6 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Project Title
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {projectDetails.title}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    About
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {projectDetails.about}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Hand Out Date
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {projectDetails.handOutDate
                      ? format(projectDetails.handOutDate, "PPpp")
                      : "N/A"}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Due Date
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {projectDetails.dueDate
                      ? format(projectDetails.dueDate, "PPpp")
                      : "N/A"}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Supervisor In Charge
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {projectDetails.supervisorId}
                    {/* Replace with actual supervisor display logic */}
                    {/* {projectDetails.supervisor ? (
                      <ul role="list" className="divide-y divide-gray-100">
                        <li
                          key={projectDetails.supervisor.email}
                          className="flex justify-between gap-x-6 py-5"
                        >
                          <div className="flex min-w-0 gap-x-4">
                            <img
                              className="h-12 w-12 flex-none rounded-full bg-gray-50"
                              src={projectDetails.supervisor.imageUrl}
                              alt=""
                            />
                            <div className="min-w-0 flex-auto">
                              <p className="text-sm font-semibold leading-6 text-gray-900">
                                {projectDetails.supervisor.name}
                              </p>
                              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                {projectDetails.supervisor.email}
                              </p>
                            </div>
                          </div>
                          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">
                              {projectDetails.supervisor.role}
                            </p>
                            {projectDetails.supervisor.lastSeen ? (
                              <p className="mt-1 text-xs leading-5 text-gray-500">
                                Last seen{" "}
                                <time
                                  dateTime={
                                    projectDetails.supervisor.lastSeenDateTime
                                  }
                                >
                                  {projectDetails.supervisor.lastSeen}
                                </time>
                              </p>
                            ) : (
                              <div className="mt-1 flex items-center gap-x-1.5">
                                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                </div>
                                <p className="text-xs leading-5 text-gray-500">
                                  Online
                                </p>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              toggleModal2(
                                "removeSupervisor",
                                projectDetails.supervisor?.email || ""
                              )
                            }
                            className="dui-btn"
                          >
                            Remove
                          </button>

                          {activeModal &&
                            activeModal2.type === "removeSupervisor" &&
                            activeModal2.id ===
                              projectDetails.supervisor.email && (
                              <RemoveSupervisorModal
                                onClose={closeModal2}
                                projectId={projectDetails._id || ""}
                              />
                            )}
                        </li>
                      </ul>
                    ) : (
                      <p>No supervisor assigned</p>
                    )} */}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Total Members
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {projectDetails.members
                      ? `${projectDetails.members.length} / 5`
                      : "Loading..."}
                  </dd>
                </div>
                <div></div>
              </dl>
            </div>
          </div>
        </m.div>
      </Layout>
    </>
  );
}
