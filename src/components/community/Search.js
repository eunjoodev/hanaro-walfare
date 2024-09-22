import { useState } from "react";
import styles from "./Search.module.css";
import Modal from "./../common/modal/Modal";

function Search({ onSearch, className = "" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("t");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      setModalMessage("작성된 검색 내용이 없습니다.");
      setShowModal(true);
      return;
    }

    onSearch(searchTerm.trim(), searchType);
  };

  return (
    <div className={`${styles.search} ${className}`}>
      <form onSubmit={handleSubmit}>
        <label>검색하기</label>
        <select
          name="type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="t">제목</option>
          <option value="c">내용</option>
          <option value="w">작성자</option>
          <option value="tc">제목+내용</option>
          <option value="tcw">제목+내용+작성자</option>
        </select>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">검색</button>
      </form>
      {showModal && (
        <Modal message={modalMessage} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default Search;
