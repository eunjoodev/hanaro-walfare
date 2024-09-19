import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Post.module.css";
import Comment from "./../../components/community/Comment";
import Button from "./../../components/common/button/Button";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const initialComments = {
  1: [
    {
      id: 1,
      userId: "user1",
      content: "첫 번째 댓글입니다.",
      date: "2024-07-21",
    },
    {
      id: 2,
      userId: "user2",
      content: "두 번째 댓글입니다.",
      date: "2024-07-23",
    },
  ],
  2: [
    {
      id: 1,
      userId: "user1",
      content: "다른 게시글의 첫 번째 댓글입니다.",
      date: "2024-07-25",
    },
  ],
};

function Post() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    id,
    title,
    content,
    author,
    createdAt,
    modifiedAt,
    userId,
    date,
    attachments = [],
  } = location.state;

  const [comments, setComments] = useState(initialComments[id] || []);

  const handleEditPost = () => {
    navigate("/community/board/create", {
      state: { title, content, isEdit: true },
    });
  };

  const handleAddComment = (newContent) => {
    const newComment = {
      id: comments.length + 1,
      userId: "newUser",
      content: newContent,
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (commentId, newContent) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, content: newContent } : comment
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  return (
    <div>
      <p className={styles.category}>자유게시판 &gt; 게시글</p>
      <div className={styles.postBox}>
        <div className={styles.postTitle}>{title}</div>
        <div className={styles.postDetail}>
          <div>작성자: {author.toLowerCase() === "unknown" ? "-" : author}</div>
          <div className={styles.detailDivider}></div>
          <div>게시날짜: {formatDate(createdAt)}</div>
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
      <div className={styles.postBtnBox}>
        <div className={styles.postEditBtnBox}>
          <Button type="submit" onClick={handleEditPost}>
            수정하기
          </Button>
        </div>
        <div className={styles.postDeleteBtnBox}>
          <Button type="submit" className={styles.postDeleteBtn}>
            삭제하기
          </Button>
        </div>
      </div>
      <Comment
        postId={id}
        comments={comments}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}

export default Post;
