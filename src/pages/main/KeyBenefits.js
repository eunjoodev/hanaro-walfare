import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    if (!benefitBoxes.length) return;

    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % benefitBoxes.length);
      }, 3800);
    }
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, benefitBoxes.length]);

  const handleBenefitClick = async (benefit) => {
    try {
      // JSON 파일에서 데이터 가져오기
      const detailDataFiles = ['detaildata1', 'detaildata2', 'detaildata3', 'detaildata4'];
      const detailDataModules = await Promise.all(
        detailDataFiles.map(file => import(`./${file}.json`))
      );

      const allData = detailDataModules.flatMap(module => module.default.data || []);

      // serviceName을 기준으로 데이터 찾기
      const matchedService = allData.find(item =>
        item.서비스명 && item.서비스명 === benefit.serviceName
      );

      if (matchedService) {
        navigate(`/welfare/detail/${encodeURIComponent(benefit.serviceName)}`);
      } else {
        console.error("Matching service not found");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };
  
  const renderBenefitBoxes = () => {
    return Array.from({ length: visibleBoxes }).map((_, i) => {
      const index = (currentIndex + i) % benefitBoxes.length;
      return (
        <div 
          className={styles.benefitBox} 
          key={benefitBoxes[index].id}
          onClick={() => handleBenefitClick(benefitBoxes[index])}
        >
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
    });
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
          <button onClick={() => setCurrentIndex((prevIndex) => (prevIndex - 1 + benefitBoxes.length) % benefitBoxes.length)} className={styles.navButton}>
            <img src="/assets/CaretLeft.png" className={styles.CaretLeft} alt="Previous" />
          </button>
          <div className={styles.separator}></div>
          <button onClick={() => setCurrentIndex((prevIndex) => (prevIndex + 1) % benefitBoxes.length)} className={styles.navButton}>
            <img src="/assets/CaretRight.png" className={styles.CaretRight} alt="Next" />
          </button>
          <button onClick={() => setIsPaused(!isPaused)} className={styles.pauseButton}>
            {isPaused ? "▶" : "||"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;
