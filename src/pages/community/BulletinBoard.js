import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import axios from "axios";
import styles from "./BulletinBoard.module.css";
import PostList from "../../components/community/postList/PostList";
import Search from "../../components/community/Search";
import Button from "../../components/common/button/Button";
import Pagination from "./../../components/common/pagination/Pagination";
import Modal from "../../components/common/modal/Modal";
import { authState } from "../../states/Auth";

const API_URL = process.env.REACT_APP_BACKEND_URL;

function BulletinBoard() {
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;
  const [showModal, setShowModal] = useState(false);

  const auth = useRecoilValue(authState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/question`, {
          params: {
            page: currentPage,
            size: postsPerPage,
          },
        });
        const { elements, pagination } = response.data;
        setFilteredData(elements);
        setAllData(elements);
        setTotalPosts(pagination.totalCount);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleWriteClick = () => {
    if (auth.isLoggedIn) {
      navigate("/community/board/create");
    } else {
      setShowModal(true);
    }
  };

  const handleTitleClick = (post) => {
    navigate(`/community/board/post`, { state: post });
  };

  const handleSearch = (term, type) => {
    const filtered = allData.filter((post) => {
      if (type === "t") return post.title.includes(term);
      if (type === "c") return post.content.includes(term);
      if (type === "w") return post.userId.includes(term);
      if (type === "tc")
        return post.title.includes(term) || post.content.includes(term);
      if (type === "tcw")
        return (
          post.title.includes(term) ||
          post.content.includes(term) ||
          post.userId.includes(term)
        );
      return true;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div>
      <Search className={styles.searchBox} onSearch={handleSearch} />
      <div className={styles.totalPosts}>
        <img src="/assets/ico_docu.png" alt="board" />
        전체 {totalPosts}건 ({currentPage} / {totalPages} 페이지)
      </div>
      <PostList data={currentPosts} onTitleClick={handleTitleClick} />
      <div className={styles.buttonContainer}>
        <Button
          type="button"
          className={styles.writeBtn}
          onClick={handleWriteClick}
        >
          게시글 작성
        </Button>
      </div>
      <Pagination
        totalPosts={totalPosts}
        postsPerPage={postsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      {showModal && (
        <Modal message="로그인을 먼저 해주세요." onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default BulletinBoard;
