import React, { useState, useEffect } from "react";
import styles from "../../../../styles/Student_Timeline.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { motion as m } from "framer-motion";
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

const Supervisor_Timeline_2SuggestedResources: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log("id:", id);

  const suggestedResourcesKey = "suggested-resources-completed";
  const [suggestedResourcesCompleted, setSuggestedResourcesCompleted] =
    useState(() => {
      const savedState = localStorage.getItem(suggestedResourcesKey);
      return savedState === "true";
    });

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
    <div className={styles.projecttimeline}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={styles.timelineMiddle}
      >
        <div className={styles.timelineMiddle3}>
          <div className={styles.timelineSectionTitle}>SUGGESTED RESOURCES</div>
          <a href="">
            <button
              className={`${styles.markAsCompletedBtn} ${
                suggestedResourcesCompleted ? styles.completed : ""
              }`}
              onClick={() =>
                setSuggestedResourcesCompleted(!suggestedResourcesCompleted)
              }
            >
              Mark As Complete
            </button>
          </a>
        </div>
        <div className={styles.timelineMiddle4}>
          <div>
            Suggested Resources is designed to provide students with additional
            guidance and resources that will assist them in their specific
            project. The main purpose of this section is to enhance students
            learning experiences by offering supplementary materials that can
            help them understand the project requirements better and
            successfully complete their tasks.
          </div>
        </div>

        <div className={styles.timelineMiddle6}>
          <h3 className="font-bold text-2xl mt-6 mb-3">Document: {resources[0]?.suggestedDetails.title}</h3>
          <p>
            {resources[0]?.suggestedDetails.description}
          </p>
          <div className={styles.timelineMiddleX}>
            <a
              href={resources[0]?.suggestedDetails.resourceDocument}
              download="Resources"
              className={styles.downloadBtn}
              target="_blank"
            >
              Download&nbsp;
              <FontAwesomeIcon icon={faDownload} className={styles.icon} />
            </a>
          </div>
        </div>

        <div className={styles.timelineMiddle6}>
          <h3 className="font-bold text-2xl mt-6 mb-3">Website</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, in,
            accusamus, repudiandae quae iure debitis animi quisquam labore ab
            itaque suscipit. Perspiciatis iste ut excepturi amet magnam atque
            repellat rem.
          </p>
          <div className={styles.resourceLink}>
            <ul className="mt-3 ml-5">
              {resources[0]?.suggestedDetails.websiteLinks.map((link, idx) => (
                // eslint-disable-next-line react/jsx-key
                <li>
                  - Reference {idx + 1}:{" "}
                  <strong>
                    {" "}
                    <a key={idx} href={link} target="_blank">
                      {link.length > 80 ? `${link.slice(0, 80)}...` : link}
                    </a>
                  </strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${styles.timelineMiddleVideoWrapper} px-3`}>
          <div className={styles.middleVideoText}>
            <h3 className="font-bold text-2xl mt-6 mb-3">Video</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos ab
              deleniti quidem odit ratione, iusto nostrum dolorem! Iste beatae
              temporibus, voluptatibus doloremque esse illum quidem, architecto
              perspiciatis magni quia molestias.
            </p>
          </div>
          <div className={styles.timelineMiddleVideo}>
            <iframe
              width="95%"
              height="100%"
              src={resources[0]?.suggestedDetails.iframeVideo}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </m.div>
    </div>
  );
};

export default Supervisor_Timeline_2SuggestedResources;
