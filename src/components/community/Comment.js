import React, { useState } from "react";
import styles from "./Comment.module.css";
import Modal from "./../common/modal/Modal";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { authState } from "../../states/Auth";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_URL;

function Comment({ postId, comments, onAddComment, onDeleteComment }) {
  const [newComment, setNewComment] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const auth = useRecoilValue(authState);
  const navigate = useNavigate();

  const handleAddComment = async () => {
    if (!auth.isLoggedIn) {
      setModalMessage("로그인을 먼저 해주세요.");
      setShowModal(true);
      return;
    }

    if (newComment.trim() === "") {
      setModalMessage("작성된 내용이 없습니다.");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/questions/${postId}/answers`,
        { content: newComment }
      );

      if (response.status === 200) {
        onAddComment(response.data);
        setNewComment("");
      } else {
        setModalMessage("댓글을 추가하는 중 문제가 발생했습니다.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setModalMessage("댓글을 추가하는 중 오류가 발생했습니다.");
      setShowModal(true);
    }
  };

  const handleDeleteClick = (commentId) => {
    setModalMessage("댓글을 삭제하시겠습니까?");
    setConfirmDelete(commentId);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete !== null) {
      try {
        const response = await axios.delete(
          `${API_URL}/questions/${postId}/answers/${confirmDelete}`
        );

        if (response.status === 200) {
          onDeleteComment(confirmDelete);
          setConfirmDelete(null);
          setModalMessage("댓글이 삭제되었습니다.");
          setShowModal(true);
        } else {
          setModalMessage("댓글을 삭제하는 중 문제가 발생했습니다.");
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error deleting comment:", error);
        setModalMessage("댓글 삭제 중 오류가 발생했습니다.");
        setShowModal(true);
      }
    }
  };

  const handleEditClick = (comment) => {
    setEditMode(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelClick = () => {
    setEditMode(null);
  };

  const handleSaveClick = (id) => {
    setModalMessage("댓글 수정이 불가능합니다.");
    setShowModal(true);
  };

  const handleLoginRedirect = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className={styles.commentBox}>
      <div className={styles.commentInputBox}>
        <textarea
          className={styles.commentTextarea}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요."
          rows={3}
        />
        <button className={styles.commentInputBtn} onClick={handleAddComment}>
          작성하기
        </button>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className={styles.commentItemBox}>
          <div className={styles.commentItem}>
            <div className={styles.commentInfo}>
              <div className={styles.commentUser}>{comment.userId}</div>
              <div className={styles.commentDate}>
                {" "}
                {new Date(comment.date).toLocaleDateString()}
              </div>
            </div>
            {editMode === comment.id ? (
              <textarea
                className={styles.commentTextarea}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
              />
            ) : (
              <div className={styles.commentContent}>{comment.content}</div>
            )}
          </div>
          <div className={styles.commentBtnBox}>
            {editMode === comment.id ? (
              <>
                <button
                  className={styles.commentSaveBtn}
                  onClick={() => handleSaveClick(comment.id)}
                >
                  저장
                </button>
                <div className={styles.divider}></div>
                <button
                  className={styles.commentCancelBtn}
                  onClick={handleCancelClick}
                >
                  취소
                </button>
              </>
            ) : (
              auth.user?.username === comment.userId && (
                <>
                  <button
                    className={styles.commentEditBtn}
                    onClick={() => handleEditClick(comment)}
                  >
                    수정
                  </button>
                  <button
                    className={styles.commentDeleteBtn}
                    onClick={() => handleDeleteClick(comment.id)}
                  >
                    삭제
                  </button>
                </>
              )
            )}
          </div>
        </div>
      ))}
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={
            confirmDelete !== null ? handleConfirmDelete : handleLoginRedirect
          }
        />
      )}
    </div>
  );
}

export default Comment;
