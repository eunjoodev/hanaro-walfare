import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WelfareBox.module.css";

const WelfareBox = ({ item, layout, index }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    if (item.serviceName) {
      const encodedServiceName = encodeURIComponent(
        item.serviceName.replace(/\s/g, "")
      );
      navigate(`/welfare/detail/${encodedServiceName}`);
    } else {
      console.error("Service name is missing");
    }
  };

  return (
    <div
      key={`welfare-${index}`}
      className={layout === "grid" ? styles.gridItem : styles.listItem}
    >
      <div
        className={
          layout === "grid"
            ? styles.gridContentContainer
            : styles.listContentContainer
        }
      >
        <div
          className={
            layout === "grid" ? styles.gridTagAndTitle : styles.listTagAndTitle
          }
        >
          <div className={layout === "grid" ? styles.gridTag : styles.listTag}>
            {item.supervisingAgencyName}
          </div>
          <div
            className={layout === "grid" ? styles.gridTitle : styles.listTitle}
          >
            {item.serviceName}
          </div>
        </div>
        <div
          className={
            layout === "grid" ? styles.gridDetails : styles.listDetails
          }
        >
          <div
            className={
              layout === "grid" ? styles.gridSummary : styles.listSummary
            }
          >
            {item.servicePurposeSummary}
          </div>
          <div
            className={
              layout === "grid" ? styles.gridFieldTag : styles.listFieldTag
            }
          >
            {item.serviceField}
          </div>
          <div className={styles.applicationContainer}>
            <div className={styles.applicationDead}>
              신청 기한: {item.applicationDeadline}
            </div>
            <div className={styles.applicationWay}>
              신청 방법: {item.applicationMethod}
            </div>
          </div>
        </div>
      </div>
      <button className={styles.detailButton} onClick={handleDetailClick}>
        상세보기
      </button>
    </div>
  );
};

export default WelfareBox;
