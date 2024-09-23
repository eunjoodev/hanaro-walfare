import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./KeyBenefits.module.css";

const KeyBenefits = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [benefitBoxes, setBenefitBoxes] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const visibleBoxes = 3;
  const imageUrls = [
    "/assets/KeyBenefitsImage/KeyBenefits01.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits02.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits03.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits04.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits05.jpg",
    "/assets/KeyBenefitsImage/KeyBenefits06.jpg",
  ];

  const navigate = useNavigate();

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
        if (data && data.data) {
          setBenefitBoxes(data.data.content.slice(0, 6));
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
    if (!benefitBoxes.length || expandedIndex !== null) return;

    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % benefitBoxes.length);
      }, 3800);
    }
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, benefitBoxes.length, expandedIndex]);

  const handleBenefitClick = (benefit) => {
    navigate(`/welfare/detail/${encodeURIComponent(benefit.serviceName)}`);
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
    if (index === expandedIndex) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const renderBenefitBoxes = () => {
    return Array.from({ length: visibleBoxes }).map((_, i) => {
      const index = (currentIndex + i) % benefitBoxes.length;
      const isExpanded = index === expandedIndex;

      return (
        <div className={styles.benefitBox} key={benefitBoxes[index].id}>
          <div
            className={styles.imageContainer}
            onClick={() => handleBenefitClick(benefitBoxes[index])}
          >
            <img
              src={imageUrls[index]}
              alt="복지 이미지"
              className={styles.benefitImage}
            />
          </div>
          <div className={styles.textContainer}>
            <h3 className={styles.benefitTitleContainer}>
              <span className={styles.benefitTitleText}>
                [{benefitBoxes[index].supervisingAgencyName}]
                {benefitBoxes[index].serviceName}
              </span>
              <img
                src="/assets/caretdown.png"
                alt="Toggle Accordion"
                className={styles.benefitTitleIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccordion(index);
                }}
              />
            </h3>
            {isExpanded && (
              <div className={styles.accordionContent}>
                <div className={styles.accordionItem}>
                  <div className={styles.gridSummary}>
                    {benefitBoxes[index].servicePurposeSummary}
                  </div>
                  <div className={styles.gridFieldTag}>
                    {benefitBoxes[index].serviceField}
                  </div>
                  <div className={styles.applicationContainer}>
                    <div className={styles.applicationDead}>
                      신청 기한: {benefitBoxes[index].applicationDeadline}
                    </div>
                    <div className={styles.applicationWay}>
                      신청 방법: {benefitBoxes[index].applicationMethod}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <section className={styles.benefitsSection}>
      <div className={styles.controlsAndTitleContainer}>
        <div className={styles.title}>주요 혜택</div>
        <div className={styles.controls}>
          <span className={styles.pageIndicator}>
            <span className={styles.currentPage}>{currentIndex + 1}</span>
            {" / "}
            <span>{benefitBoxes.length}</span>
          </span>
          <div className={styles.buttons}>
            <button
              onClick={() =>
                setCurrentIndex(
                  (prevIndex) =>
                    (prevIndex - 1 + benefitBoxes.length) % benefitBoxes.length
                )
              }
              className={styles.navButton}
            >
              <img
                src="/assets/CaretLeft.png"
                className={styles.CaretLeft}
                alt="Previous"
              />
            </button>
            <div className={styles.separator}></div>
            <button
              onClick={() =>
                setCurrentIndex(
                  (prevIndex) => (prevIndex + 1) % benefitBoxes.length
                )
              }
              className={styles.navButton}
            >
              <img
                src="/assets/CaretRight.png"
                className={styles.CaretRight}
                alt="Next"
              />
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={styles.pauseButton}
            >
              {isPaused ? "▶" : "||"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.imagesContainer}>
        {benefitBoxes.length > 0 ? renderBenefitBoxes() : <p>로딩 중...</p>}
      </div>
    </section>
  );
};

export default KeyBenefits;
