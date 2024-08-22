import React from "react";
import styles from "../../../styles/Student_Timeline.module.css";
import { motion as m } from "framer-motion";
import people from "../../../mocks/people";
import Layout from "@/components/Layout";
import Student_Timeline_Header from "../timeline-components/Student_Timeline_Header";

export default function StudentProject_Members() {
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
                Members Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Meet your group members!
              </p>
            </div>
            <ul role="list" className="divide-y divide-gray-100">
              {people.map((person) => (
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
                </li>
              ))}
            </ul>
          </div>
        </m.div>
      </Layout>
    </>
  );
}
