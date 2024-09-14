import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import styles from "./CreatePost.module.css";
import Button from "./../../components/common/button/Button";

const API_URL = process.env.REACT_APP_BACKEND_URL;

function CreatePost() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isEdit = state?.isEdit || false;
  const [title, setTitle] = useState(state?.title || "");
  const [content, setContent] = useState(state?.content || "");
  const [files, setFiles] = useState([]);

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
      // FormData 객체 생성
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // 선택된 파일을 FormData에 추가
      for (let i = 0; i < files.length; i++) {
        formData.append("multipartFileList", files[i]);
      }

      const response = await axios.post(`${API_URL}/question/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post Response:", response.data);
      navigate("/community/board");
    } catch (error) {
      console.error("Error submitting post", error);
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
          />
        </div>
        <Button type="submit" className={styles.submitButton}>
          {isEdit ? "수정하기" : "작성하기"}
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
