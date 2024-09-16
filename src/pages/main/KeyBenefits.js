import React, { useState, useEffect } from "react";
import styles from "./KeyBenefits.module.css";

const KeyBenefits = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [benefitBoxes, setBenefitBoxes] = useState([]);

  const visibleBoxes = 3;
  const imageUrls = [
    "/assets/KeyBenefitsImage/KeyBenefits01.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits02.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits03.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits04.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits05.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits06.jpg",
  ];

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const env = process.env.REACT_APP_ENV || "development";
        const apiUrl =
          env === "production"
            ? `${process.env.REACT_APP_PROXY_URL}/main?page=0&size=6`
            : `${process.env.REACT_APP_BACKEND_URL}/main?page=0&size=6`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("API 응답 데이터:", data);
        if (data && data.data) {
          setBenefitBoxes(data.data.content.slice(0, 6));
          // setBenefitBoxes(data.data.content || []);
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
      }, 3800);
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
          (prevIndex - 1 + benefitBoxes.length) % benefitBoxes.length
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
        <div className={styles.benefitBox} key={benefitBoxes[index].id}>
          <div className={styles.imageContainer}>
            <img
              src={imageUrls[index]}
              alt="복지 이미지"
              className={styles.benefitImage}
            />
          </div>
          <div className={styles.textContainer}>
            <h3 className={styles.benefitTitle}>
              [{benefitBoxes[index].supervisingAgencyName}]
              {benefitBoxes[index].serviceName}
            </h3>
            <div className={styles.summary}>
              {benefitBoxes[index].servicePurposeSummary}
            </div>
          </div>
        </div>
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
