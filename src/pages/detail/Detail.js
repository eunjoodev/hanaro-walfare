import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Button from "../../components/common/button/Button";
import styles from "./Detail.module.css";
import Footer from "../../components/Footer";
import Sidebar from "../../components/common/sidebar/Sidebar";

const Detail = () => {
  const { serviceName } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location.state && location.state.benefitData) {
          setData(location.state.benefitData);
          setLoading(false);
          return;
        }

        console.log("Received serviceName:", decodeURIComponent(serviceName));

        const detailDataFiles = ['detaildata1', 'detaildata2', 'detaildata3', 'detaildata4'];
        const detailDataModules = await Promise.all(
          detailDataFiles.map(file => import(`./${file}.json`))
        );

        const allData = detailDataModules.flatMap(module => module.default.data || []);

        console.log("All Detail Data:", allData);

        const serviceData = allData.find(item => 
          item.서비스명 && 
          item.서비스명.toLowerCase().replace(/\s/g, '') === 
          decodeURIComponent(serviceName).toLowerCase().replace(/\s/g, '')
        );

        if (serviceData) {
          setData(serviceData);
          console.log("Found service data:", serviceData);
        } else {
          console.error("Service not found");
          console.log("Available services:", allData.map(item => item.서비스명).filter(Boolean));
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceName, location.state]);

  const handleButtonClick = () => {
    window.location.href = "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/149200000026";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Service not found. Please check the service name and try again.</div>;
  }

  return (
    <>
      <div className={styles.layoutContainer}>
        <div className={styles.contentContainer}>
          <div className={styles.sidebarWrapper}>
            <Sidebar
              title="복지서비스 상세"
              items={[
                { name: "상세정보", active: true },
                { name: "생애주기", active: false },
              ]}
              onItemClick={() => {}}
            />
          </div>
          <div className={styles.mainContent}>
            <div className={styles.serviceHeader}>
              <h1>{data.서비스명}</h1>
              <p>{data.서비스목적요약}</p>
            </div>
            <table className={styles.infoTable}>
              <thead>
                <tr>
                  <th>기준연도</th>
                  <th>문의처</th>
                  <th>지원주기</th>
                  <th>제공유형</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.기준연도}</td>
                  <td>{data.문의처}</td>
                  <td>{data.지원주기}</td>
                  <td>{data.제공유형}</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.buttonWrapper}>
              <Button onClick={handleButtonClick} className={styles.applyButton}>
                신청하기
              </Button>
            </div>

            <div className={styles.tabNavigation}>
              <button className={styles.activeTab}>주요내용</button>
              <button>지원대상</button>
              <button>지원내용</button>
              <button>신청방법</button>
              <button>접수/문의</button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {/* Example content for "주요내용" tab */}
              <p><strong>신청기간:</strong> 상시신청</p>
              <p><strong>전화문의:</strong> 고용노동부 고객상담센터 (1350)</p>
              {/* Add more content as needed */}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Detail;
