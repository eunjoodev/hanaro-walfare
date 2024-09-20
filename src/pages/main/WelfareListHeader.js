import React, { useState } from "react";
import styles from "./WelfareListHeader.module.css";

const WelfareListHeader = ({ totalItems, layout, setLayout }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleCloseTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.totalItems}>총 게시물: {totalItems}개</div>

      {showTooltip && (
        <div className={styles.tooltip}>
          <p>보기 편한 방식을 선택해 보세요!</p>
          <button className={styles.closeButton} onClick={handleCloseTooltip}>
            X
          </button>
        </div>
      )}

      <div className={styles.controls}>
        <label>
          목록 표시 갯수:
          <span className={styles.fixedItems}>24개</span>
        </label>

        <button
          className={`${styles.iconButton} ${
            layout === "grid" ? styles.active : ""
          }`}
          onClick={() => setLayout("grid")}
        >
          <img
            src="/assets/gridIcon.png"
            alt="Grid View"
            className={styles.icon}
          />
        </button>

        <button
          className={`${styles.iconButton} ${
            layout === "list" ? styles.active : ""
          }`}
          onClick={() => setLayout("list")}
        >
          <img
            src="/assets/listIcon.png"
            alt="List View"
            className={styles.icon}
          />
        </button>
      </div>
    </div>
  );
};

export default WelfareListHeader;
