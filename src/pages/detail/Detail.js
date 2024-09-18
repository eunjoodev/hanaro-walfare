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
  const [activeTab, setActiveTab] = useState("지원대상");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let benefitData;

        if (location.state && location.state.benefitData) {
          benefitData = location.state.benefitData;
        } else {
          const detailDataFiles = ['detaildata1', 'detaildata2', 'detaildata3', 'detaildata4'];
          const detailDataModules = await Promise.all(
            detailDataFiles.map(file => import(`./${file}.json`))
          );

          const allData = detailDataModules.flatMap(module => module.default.data || []);

          benefitData = allData.find(item =>
            item.서비스명 && 
            item.서비스명.toLowerCase().replace(/\s/g, '') === 
            decodeURIComponent(serviceName).toLowerCase().replace(/\s/g, '')
          );
        }

        if (benefitData) {
          setData(benefitData);
          console.log("Found service data:", benefitData);
        } else {
          console.error("Service not found");
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
    if (data && data.상세조회URL) {
      window.open(data.상세조회URL, '_blank');
    } else {
      console.error("상세조회URL이 없습니다.");
    
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "주요내용":
        return (
          <>
            <p><strong>신청기간:</strong> {data.신청기한}</p>
            <p><strong>전화문의:</strong> {data.전화문의}</p>
          </>
        );
      case "지원유형":
        return <p>{data.지원유형}</p>;
      case "지원대상":
        return <p>{data.지원대상}</p>;
      case "지원내용":
        return <p>{data.지원내용}</p>;
      case "신청방법":
        return <p>{data.신청방법}</p>;
      case "상세조회URL":
        return <p>{data.상세조회URL}</p>;  
      default:
        return null;
    }
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
                  <th>서비스분야</th>
                  <th>선정기준</th>
                  <th>소관기관명</th>
                  <th>신청방법</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.서비스분야}</td>
                  <td>{data.선정기준}</td>
                  <td>{data.소관기관명}</td>
                  <td>{data.신청방법}</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.buttonWrapper}>
              <Button onClick={handleButtonClick} className={styles.applyButton}>
                신청하기
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabNavigation}>
              {["지원유형", "지원대상", "지원내용", "신청방법", "상세조회URL"].map(tab => (
                <button
                  key={tab}
                  className={activeTab === tab ? styles.activeTab : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {renderTabContent()}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Detail;
