import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Post.module.css";
import axios from "axios";
import Comment from "./../../components/community/Comment";
import Button from "./../../components/common/button/Button";
import Modal from "./../../components/common/modal/Modal";
import { useRecoilValue } from "recoil";
import { authState } from "../../states/Auth";

const API_URL = process.env.REACT_APP_BACKEND_URL;

function Post() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);

  const {
    id,
    title,
    content,
    author,
    createdAt,
    attachments = [],
  } = location.state;

  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(`${API_URL}/question/${id}`);
      if (response.ok) {
        setModalMessage("게시물이 삭제되었습니다.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/community/board");
  };

  const handleEditPost = () => {
    navigate("/community/board/create", {
      state: { id, title, content, isEdit: true },
    });
  };

  const isAuthor = auth.user?.username === author;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_URL}/questions/${id}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const handleAddComment = async (newContent) => {
    try {
      const response = await axios.post(`${API_URL}/questions/${id}/answers`, {
        content: newContent,
      });
      if (response.status === 200) {
        setComments([...comments, response.data]);
      } else {
        console.error("Failed to add comment", response);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // const handleEditComment = (commentId, newContent) => {
  //   setComments((prevComments) =>
  //     prevComments.map((comment) =>
  //       comment.id === commentId ? { ...comment, content: newContent } : comment
  //     )
  //   );
  // };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/questions/${id}/answers/${commentId}`
      );
      if (response.status === 200) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div>
      <p className={styles.category}>자유게시판 &gt; 게시글</p>
      <div className={styles.postBox}>
        <div className={styles.postTitle}>{title}</div>
        <div className={styles.postDetail}>
          <div>작성자: {author.toLowerCase() === "unknown" ? "-" : author}</div>
          <div className={styles.detailDivider}></div>
          <div>게시날짜: {new Date(createdAt).toLocaleDateString()}</div>
        </div>
        <div
          className={styles.postContent}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        {attachments.length > 0 && (
          <div className={styles.attachments}>
            <h4>첨부파일</h4>
            <ul>
              {attachments.map((file, index) => (
                <li key={index}>
                  <a href={file.url} download={file.name}>
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {isAuthor && (
        <div className={styles.postBtnBox}>
          <div className={styles.postEditBtnBox}>
            <Button type="submit" onClick={handleEditPost}>
              수정하기
            </Button>
          </div>
          <div className={styles.postDeleteBtnBox}>
            <Button
              type="submit"
              className={styles.postDeleteBtn}
              onClick={handleDeletePost}
            >
              삭제하기
            </Button>
          </div>
        </div>
      )}
      {showModal && <Modal message={modalMessage} onClose={handleModalClose} />}
      <Comment
        postId={id}
        comments={comments}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}

export default Post;
