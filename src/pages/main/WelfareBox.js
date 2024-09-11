import React from "react";
import styles from "./WelfareBox.module.css";

const WelfareBox = ({ item, layout }) => {
  return (
    <div className={layout === "grid" ? styles.gridItem : styles.listItem}>
      <h3>{item.serviceName}</h3>
      <p>분야: {item.serviceField}</p>
      <p>기관: {item.supervisingAgencyName}</p>
      <p>신청 기한: {item.applicationDeadline}</p>
      <p>신청 방법: {item.applicationMethod}</p>
      <p>설명: {item.servicePurposeSummary}</p>
    </div>
  );
};

export default WelfareBox;
