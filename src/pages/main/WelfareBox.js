import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WelfareBox.module.css";

const WelfareBox = ({ item, layout, index }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    if (item.serviceName) {
      const encodedServiceName = encodeURIComponent(item.serviceName.replace(/\s/g, ''));
      navigate(`/welfare/detail/${encodedServiceName}`);
    } else {
      console.error("Service name is missing");
    }
  };
  
  
  return (
    <div key={`welfare-${index}`} className={layout === "grid" ? styles.gridItem : styles.listItem}>
      <div className={styles.contentContainer}>
        <div className={styles.tag}>{item.supervisingAgencyName}</div>
        <div className={styles.title}>{item.serviceName}</div>
        <div className={styles.summary}>{item.servicePurposeSummary}</div>
        <div className={styles.fieldTag}>{item.serviceField}</div>
        <div className={styles.applicationDead}>
          신청 기한: {item.applicationDeadline}
        </div>
        <div className={styles.applicationWay}>
          신청 방법: {item.applicationMethod}
        </div>
      </div>
      <button className={styles.detailButton} onClick={handleDetailClick}>
        상세보기
      </button>
    </div>
  );
};

export default WelfareBox;
