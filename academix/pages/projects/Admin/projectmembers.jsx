import React, { useState, useEffect } from "react";
import style from "../../../styles/Student_Timeline.module.css";
import { motion as m } from "framer-motion";
import people from "../../../mocks/people";
import RemoveProjectMembersModal from "../timeline-components/RemoveProjectMembersModal";
import Admin_Timeline_Header from "../timeline-components/Admin_Timeline_Header";
import Layout from "@/components/Layout";

export default function SupervisorProject_Members() {
  const [activeModal, setActiveModal] = useState({ type: null, id: null });
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (people) {
      setMembers(people);
    }
  }, []);

  const toggleModal = (modal, id) => {
    const isActive = activeModal.type === modal && activeModal.id === id;
    setActiveModal(
      isActive ? { type: null, id: null } : { type: modal, id: id }
    );
  };

  const closeModal = () => {
    setActiveModal({ type: null, id: null });
  };

  return (
    <>
      <Layout>
        <Admin_Timeline_Header />
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className={style.timelineMiddle}
        >
          <div className={style.timelineWrapper2}>
            <div className="p-16 bg-white">
              <div className="px-4 sm:px-0 ">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Members Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Meet your group members!
                </p>
              </div>

              <ul role="list" className="divide-y divide-gray-100">
                {members.map((person) => (
                  <li
                    key={person.email}
                    className="flex justify-between gap-x-6 py-5"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <img
                        className="h-12 w-12 flex-none rounded-full bg-gray-50"
                        src={person.imageUrl}
                        alt=""
                      />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {person.name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {person.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-x-4">
                      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="text-sm leading-6 text-gray-900">
                          {person.role}
                        </p>
                        {person.lastSeen ? (
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            Last seen{" "}
                            <time dateTime={person.lastSeenDateTime}>
                              {person.lastSeen}
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
                      {/* Pass the person's email (or any unique identifier) when calling toggleModal */}
                      <button
                        onClick={() =>
                          toggleModal("removeProjectMember", person.email)
                        }
                        className="dui-btn"
                      >
                        Remove
                      </button>
                      {/* Update the condition to display the modal */}
                      {activeModal.type === "removeProjectMember" &&
                        activeModal.id === person.email && (
                          <RemoveProjectMembersModal onClose={closeModal} />
                        )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="relative my-5">
                <button className="dui-btn dui-btn-outline h-5 min-w-20 absolute right-0">
                  + Add Member
                </button>
              </div>
            </div>
          </div>
        </m.div>
      </Layout>
    </>
  );
}
