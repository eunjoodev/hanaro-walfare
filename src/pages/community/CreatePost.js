import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import styles from "./CreatePost.module.css";
import Button from "./../../components/common/button/Button";
import Modal from "./../../components/common/modal/Modal";

const API_URL = process.env.REACT_APP_BACKEND_URL;

function CreatePost() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isEdit = state?.isEdit || false;
  const [title, setTitle] = useState(state?.title || "");
  const [content, setContent] = useState(state?.content || "");
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setContent(state?.content || "");
    }
  }, [isEdit, state?.content]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // 선택된 파일을 FormData에 추가
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // 서버의 스웨거 정의에 맞춰 "files"로 추가
      }

      const response = await axios.post(`${API_URL}/question/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 서버에서 성공적으로 응답이 오면 모달을 띄움
      if (response.status === 200) {
        setShowModal(true); // 모달 표시
        console.log("게시글 등록 성공");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "link",
  ];

  const handleModalClose = () => {
    setShowModal(false); // 모달을 닫고
    navigate("/community/board"); // 게시글 리스트 페이지로 이동
  };

  return (
    <div className={styles.createBoard}>
      <p className={styles.category}>
        {isEdit ? "자유게시판 > 게시글 수정" : "자유게시판 > 새 게시글 작성"}
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.title}>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.titleInput}
            required
          />
        </div>
        <div className={styles.formGroup2}>
          <label className={styles.content}>내용</label>
          <ReactQuill
            value={content || ""}
            onChange={setContent}
            className={styles.quill}
            theme="snow"
            placeholder="내용을 작성해주세요."
            modules={modules}
            formats={formats}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.fileLabel}>첨부 파일</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>
        <Button type="submit" className={styles.submitButton}>
          {isEdit ? "수정하기" : "작성하기"}
        </Button>
      </form>
      {showModal && (
        <Modal message="게시글이 등록되었습니다." onClose={handleModalClose} />
      )}
    </div>
  );
}

export default CreatePost;
