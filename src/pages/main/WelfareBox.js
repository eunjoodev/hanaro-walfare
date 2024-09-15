import React from "react";
import styles from "./WelfareBox.module.css";

const WelfareBox = ({ item, layout }) => {
  return (
    <div className={layout === "grid" ? styles.gridItem : styles.listItem}>
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
      <button className={styles.detailButton}>상세보기</button>
    </div>
  );
};

export default WelfareBox;
