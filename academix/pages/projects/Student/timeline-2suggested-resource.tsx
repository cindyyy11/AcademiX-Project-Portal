import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Project_Timeline_RightNav from "../timeline-components/Project_Timeline_RightNav";
import Student_Timeline_Header from "../timeline-components/Student_Timeline_Header";
import { motion as m } from "framer-motion";
import styles from "../../../styles/Student_Timeline.module.css";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";

type SuggestedDetails = {
  resourceDocument: string;
  websiteLinks: string[];
  iframeVideo: string;
  title: string;
  description: string;
  datetime: string;
};

type Resource = {
  suggestedDetails: SuggestedDetails;
};

const Student_Timeline_2SuggestedResources: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  const suggestedResourcesKey = "suggested-resources-completed";
  const [suggestedResourcesCompleted, setSuggestedResourcesCompleted] =
    useState<boolean>(false);

  useEffect(() => {
    const savedState = localStorage.getItem(suggestedResourcesKey);
    setSuggestedResourcesCompleted(savedState === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem(
      suggestedResourcesKey,
      suggestedResourcesCompleted.toString()
    );
  }, [suggestedResourcesCompleted]);

  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    if (id) {
      fetchResource(id as string);
    }
  }, [id]);

  async function fetchResource(projectId: string) {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/get-suggested-resource/${projectId}`
      );
      console.log("Fetched resource:", response.data);

      const dataResource = response.data;
      if (
        dataResource &&
        dataResource.success &&
        dataResource.suggestedDetails
      ) {
        const newResource: Resource = {
          suggestedDetails: {
            resourceDocument:
              dataResource.suggestedDetails.resourceDocument || "",
            websiteLinks: dataResource.suggestedDetails.websiteLinks || [],
            iframeVideo: dataResource.suggestedDetails.iframeVideo || "",
            title: dataResource.suggestedDetails.title || "",
            description: dataResource.suggestedDetails.description || "",
            datetime: dataResource.suggestedDetails.datetime || "",
          },
        };

        setResources([newResource]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  console.log("resources:", resources);

  if (!resources) {
    return <div>Loading...</div>;
  }

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
                  SUGGESTED RESOURCES
                </div>
                <Link href="">
                  <button
                    className={`${styles.markAsCompletedBtn} ${
                      suggestedResourcesCompleted ? styles.completed : ""
                    }`}
                    onClick={() =>
                      setSuggestedResourcesCompleted(
                        !suggestedResourcesCompleted
                      )
                    }
                  >
                    Mark As Complete
                  </button>
                </Link>
              </div>
              <div className={styles.timelineMiddle4}>
                <div>
                  Suggested Resources is designed to provide students with
                  additional guidance and resources that will assist them in
                  their specific project. The main purpose of this section is to
                  enhance students learning experiences by offering
                  supplementary materials that can help them understand the
                  project requirements better and successfully complete their
                  tasks.
                </div>
              </div>

              <div className={styles.timelineMiddle6}>
                <h3 className="font-bold text-2xl mt-6 mb-3">
                  Document: {resources[0]?.suggestedDetails.title}
                </h3>
                <p>{resources[0]?.suggestedDetails.description}</p>
                <div className={styles.timelineMiddleX}>
                  <a
                    href={resources[0]?.suggestedDetails.resourceDocument}
                    download="Resources"
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

              <div className={styles.timelineMiddle6}>
                <h3 className="font-bold text-2xl mt-6 mb-3">Website</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Dolore, in, accusamus, repudiandae quae iure debitis animi
                  quisquam labore ab itaque suscipit. Perspiciatis iste ut
                  excepturi amet magnam atque repellat rem.
                </p>
                <div className={styles.resourceLink}>
                  {/* <ul>
                    <li>
                      <a href="https://www.wrike.com/project-management-guide/faq/what-is-agile-methodology-in-project-management/">
                        What Is Agile Methodology in Project Management?
                      </a>
                    </li>
                    <li>
                      <a href="https://www.lucidchart.com/pages/data-flow-diagram">
                        What is a Data Flow Diagram
                      </a>
                    </li>
                    <li>
                      <a href="https://www.techtarget.com/searchdatamanagement/definition/entity-relationship-diagram-ERD#:~:text=An%20entity%20relationship%20diagram%20(ERD)%2C%20also%20known%20as%20an,information%20technology%20(IT)%20system.">
                        entity relationship diagram (ERD)
                      </a>
                    </li>
                  </ul> */}
                  <ul className="mt-3 ml-5">
                    {resources[0]?.suggestedDetails.websiteLinks.map(
                      (link, idx) => (
                        // eslint-disable-next-line react/jsx-key
                        <li>
                          - Reference {idx + 1}:{" "}
                          <strong>
                            {" "}
                            <a key={idx} href={link} target="_blank">
                              {link.length > 80
                                ? `${link.slice(0, 80)}...`
                                : link}
                            </a>
                          </strong>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <div className={`${styles.timelineMiddleVideoWrapper} px-3`}>
                <div className={styles.middleVideoText}>
                  <h3 className="font-bold text-2xl mt-6 mb-3">Video</h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
                    ab deleniti quidem odit ratione, iusto nostrum dolorem! Iste
                    beatae temporibus, voluptatibus doloremque esse illum
                    quidem, architecto perspiciatis magni quia molestias.
                  </p>
                </div>
                <div className={styles.timelineMiddleVideo}>
                  <iframe
                    width="95%"
                    height="100%"
                    src={resources[0]?.suggestedDetails.iframeVideo}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              <div className={styles.completeButtonWrapper}>
                <Link
                  href={`/projects/Student/timeline-1view-case-studye/?id=${id}`}
                >
                  <button className={styles.backBtn}>Back</button>
                </Link>

                <Link href={`/projects/Student/timeline-3proposal/?id=${id}`}>
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

export default Student_Timeline_2SuggestedResources;
