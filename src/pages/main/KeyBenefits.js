import React, { useState, useEffect } from "react";
import styles from "./KeyBenefits.module.css";

const KeyBenefits = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [benefitBoxes, setBenefitBoxes] = useState([]);

  const visibleBoxes = 3;

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        // 프록시 URL 설정
        const apiUrl = `/api/proxy/main?page=0&size=6`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("API 응답 데이터:", data);
        if (data && data.data) {
          setBenefitBoxes(data.data.content || []);
        } else {
          console.error("Unexpected response structure", data);
        }
      } catch (error) {
        console.error("Failed to fetch benefits:", error);
      }
    };

    fetchBenefits();
  }, []);

  useEffect(() => {
    if (!benefitBoxes.length) return;

    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % benefitBoxes.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, benefitBoxes.length]);

  const handleNext = () => {
    if (benefitBoxes.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % benefitBoxes.length);
    }
  };

  const handlePrev = () => {
    if (benefitBoxes.length > 0) {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + benefitBoxes.length) % benefitBoxes.length,
      );
    }
  };

  const handlePausePlay = () => {
    setIsPaused(!isPaused);
  };

  const renderBenefitBoxes = () => {
    const boxesToShow = [];
    for (let i = 0; i < visibleBoxes; i++) {
      const index = (currentIndex + i) % benefitBoxes.length;
      boxesToShow.push(
        <a
          href="/detail"
          className={styles.benefitBox}
          key={benefitBoxes[index].id}
        >
          <h3>{benefitBoxes[index].serviceName}</h3>
          <p>분야: {benefitBoxes[index].serviceField}</p>
          <p>기관: {benefitBoxes[index].supervisingAgencyName}</p>
          <p>신청 기한: {benefitBoxes[index].applicationDeadline}</p>
          <p>신청 방법: {benefitBoxes[index].applicationMethod}</p>
          <p>설명: {benefitBoxes[index].servicePurposeSummary}</p>
        </a>,
      );
    }
    return boxesToShow;
  };

  return (
    <section className={styles.benefitsSection}>
      <div className={styles.title}>주요 혜택</div>
      <div className={styles.imagesContainer}>
        {benefitBoxes.length > 0 ? renderBenefitBoxes() : <p>로딩 중...</p>}
      </div>
      <div className={styles.controls}>
        <span className={styles.pageIndicator}>
          <span className={styles.currentPage}>{currentIndex + 1}</span>
          {" / "}
          <span>{benefitBoxes.length}</span>
        </span>
        <div className={styles.buttons}>
          <button onClick={handlePrev} className={styles.navButton}>
            <img src="/assets/CaretLeft.png" className={styles.CaretLeft} />
          </button>
          <div className={styles.separator}></div>
          <button onClick={handleNext} className={styles.navButton}>
            <img src="/assets/CaretRight.png" className={styles.CaretRight} />
          </button>
          <button onClick={handlePausePlay} className={styles.pauseButton}>
            {isPaused ? "▶" : "||"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;