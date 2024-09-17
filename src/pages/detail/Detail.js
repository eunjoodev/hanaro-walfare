import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/common/button/Button";
import Pagination from "../../components/common/pagination/Pagination";
import styles from "./Detail.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/common/sidebar/Sidebar";
import detailData from "./maindata.json"; // JSON 파일 import
const PAGE_SIZE = 5;

const Detail = () => {
  const { serviceName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // URL 파라미터로 받은 serviceName을 사용하여 detailData에서 해당 서비스 찾기
        const serviceData = detailData.find(item => item.서비스명 === decodeURIComponent(serviceName));
        if (serviceData) {
          setData({
            service_name: serviceData.서비스명,
            service_purpose_summary: serviceData.서비스목적요약
          });
          setLikeCount(0);
          setDislikeCount(0);
          setComments([]);
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
  }, [serviceName]);

  // ... 나머지 코드는 동일

  return (
    <>
      <Header className={styles.headerTitle} />
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
            {loading ? (
              <p>Loading...</p>
            ) : data ? (
              <>
                <div className={styles.headerContent}>
                  <h3>서비스명: {data.service_name}</h3>
                  <p>서비스 목적 요약: {data.service_purpose_summary}</p>
                </div>
                <div className={styles.infoBox}>
                  <h1>{data.service_name}</h1>
                  <p>{data.service_purpose_summary}</p>
                </div>
                {/* ... 나머지 UI 요소들 */}
              </>
            ) : (
              <p>Service not found</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Detail;
