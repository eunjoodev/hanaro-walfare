import React, { useState } from "react";
import styles from "./RecommendationModal.module.css";

const PAGE_SIZE = 10; // 페이지당 기사 수를 10개로 설정

const RecommendationModal = ({ isOpen, onClose, recommendations }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  const totalPages = Math.ceil(recommendations.length / PAGE_SIZE);
  const indexOfLastRec = currentPage * PAGE_SIZE;
  const indexOfFirstRec = indexOfLastRec - PAGE_SIZE;
  const currentRecs = recommendations.slice(indexOfFirstRec, indexOfLastRec);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <div className={styles.modalMessage}>추천 뉴스</div>
        <div className={styles.ulContainer}>
          <ul>
            {currentRecs.length > 0 ? (
              currentRecs.map((rec, index) => <li key={index}>{rec.title}</li>)
            ) : (
              <li>추천 뉴스가 없습니다.</li>
            )}
          </ul>
        </div>
        <div className={styles.modalBtnBox}>
          <button className={styles.confirmBtn} onClick={onClose}>
            닫기
          </button>
        </div>
        <div className={styles.paginationContainer}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;
