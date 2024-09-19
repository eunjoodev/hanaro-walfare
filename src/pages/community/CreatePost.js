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
  const [modalMessage, setModalMessage] = useState("");

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      if (isEdit) {
        const response = await axios.put(
          `${API_URL}/question/${state.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          setModalMessage("게시물이 수정되었습니다.");
          setShowModal(true);
        }
      } else {
        const response = await axios.post(`${API_URL}/question`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 200) {
          setModalMessage("게시물이 작성되었습니다.");
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    if (isEdit) {
      navigate(`/community/board/post`, { state: { id: state.id } });
    } else {
      navigate("/community/board");
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
      {showModal && <Modal message={modalMessage} onClose={handleModalClose} />}
    </div>
  );
}

export default CreatePost;
