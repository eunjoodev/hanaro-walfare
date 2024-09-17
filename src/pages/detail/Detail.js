import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/common/button/Button";
import Pagination from "../../components/common/pagination/Pagination";
import styles from "./Detail.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/common/sidebar/Sidebar";

const PAGE_SIZE = 5; // Set the number of comments per page

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
  }, [serviceName]);

  const handleButtonClick = () => {
    window.location.href = "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/149200000026";
  };

  const handleLike = () => {
    setLikeCount(likeCount + 1);
  };

  const handleDislike = () => {
    setDislikeCount(dislikeCount + 1);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.trim()) {
      const updatedComments = [
        ...comments,
        { id: comments.length + 1, text: newComment },
      ];
      setComments(updatedComments);
      setNewComment("");
    }
  };

  const indexOfLastComment = currentPage * PAGE_SIZE;
  const indexOfFirstComment = indexOfLastComment - PAGE_SIZE;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Service not found. Please check the service name and try again.</div>;
  }

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
          <div className={styles.fullDataSection}>
              <h2>전체 데이터:</h2>
              <table className={styles.dataTable}>
                <tbody>
                  {Object.entries(data).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{JSON.stringify(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.buttonWrapper}>
              <Button onClick={handleButtonClick} className={styles.largeButton}>
                신청하기
              </Button>
            </div>
            <div className={styles.reactions}>
              <button onClick={handleLike} className={styles.likeButton}>
                좋아요 ({likeCount})
              </button>
              <button onClick={handleDislike} className={styles.dislikeButton}>
                싫어요 ({dislikeCount})
              </button>
            </div>
            <div className={styles.commentsSection}>
              <h2>의견</h2>
              <ul className={styles.commentsList}>
                {currentComments.map((comment) => (
                  <li key={comment.id} className={styles.commentItem}>
                    {comment.text}
                  </li>
                ))}
              </ul>
              <Pagination
                totalPosts={comments.length}
                postsPerPage={PAGE_SIZE}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
              <div className={styles.commentFormContainer}>
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="의견을 작성하세요"
                    className={styles.commentInput}
                  ></textarea>
                  <button type="submit" className={styles.commentSubmitButton}>
                    제출
                  </button>
                </form>
              </div>
            </div>
          
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Detail;
