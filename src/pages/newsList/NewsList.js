import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import styles from "./NewsList.module.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Pagination from "../../components/common/pagination/Pagination";
import RecommendationModal from "./RecommendationModal";

const PAGE_SIZE = 50;

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [searchCounts, setSearchCounts] = useState({}); // 상태 추가

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const response = await fetch("/news.csv");
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value);
        const results = Papa.parse(csv, { header: true });

        console.log("Fetched CSV Data:", results.data); // CSV 데이터 로그 출력
        setArticles(results.data);
      } catch (error) {
        console.error("Error fetching the CSV data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCSV();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1);

    // 검색어 입력 횟수 증가
    setSearchCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      if (newCounts[value]) {
        newCounts[value] += 1;
      } else {
        newCounts[value] = 1;
      }
      return newCounts;
    });

    // 키워드를 기반으로 CSV 데이터에서 추천 뉴스 검색
    const recommendedArticles = articles.filter((article) => {
      // undefined 확인 및 필터링
      if (!article.title) {
        console.warn("Article without title:", article);
        return false;
      }
      return article.title.toLowerCase().includes(value);
    });

    console.log("Recommended Articles:", recommendedArticles); // 추천 기사 로그 출력
    setRecommendations(recommendedArticles); // 찾은 추천 기사 설정

    // 검색어 입력 횟수가 10번 이상인 경우에만 모달을 표시
    if (searchCounts[value] >= 10) {
      setModalOpen(true); // 모달 열기 상태로 설정
    } else {
      setModalOpen(false); // 모달 닫기 상태로 설정
    }

    console.log(`Search count for ${value}: ${searchCounts[value] || 0}`);
  };

  const handleArticleClick = async (article) => {
    const { data, error } = await supabase
      .from("click_data")
      .insert([{ article_id: article.id }]);

    if (error) console.error("Error saving click data:", error);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // 기본 폼 제출 방지
    handleSearch({ target: { value: searchTerm } }); // 검색 실행
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title &&
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastArticle = currentPage * PAGE_SIZE;
  const indexOfFirstArticle = indexOfLastArticle - PAGE_SIZE;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.contentWrap}>
          <div className={styles.newsListContainer}>
            <h1>뉴스리스트</h1>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={handleSearch}
                className={styles.searchBar}
              />
              <button type="submit" className={styles.searchButton}>
                <i className="fas fa-search"></i>{" "}
                {/* Font Awesome search icon */}
              </button>
            </form>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <table className={styles.newsTable}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>제목</th>
                      <th>링크</th>
                      <th>작성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentArticles.map((article) => (
                      <tr
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                      >
                        <td>{article.id}</td>
                        <td>{article.title || "N/A"}</td>
                        <td>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </td>
                        <td>
                          {article.created_at
                            ? new Date(article.created_at).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination
                  totalPosts={filteredArticles.length}
                  postsPerPage={PAGE_SIZE}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <RecommendationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        recommendations={recommendations}
      />
    </>
  );
};

export default NewsList;
