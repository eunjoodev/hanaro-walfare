import styles from "./PostList.module.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function PostList({ data, userId, onTitleClick }) {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <div className={styles.tableRow}>
          <div className={styles.tableCell}>번호</div>
          <div className={styles.tableCell}>작성자</div>
          <div className={styles.tableCell}>제목</div>
          <div className={styles.tableCell}>게시날짜</div>
          <div className={styles.tableCell}>조회수</div>
        </div>
      </div>
      <div className={styles.tableBody}>
        {data.length > 0 ? (
          data.map((post) => (
            <div className={styles.tableRow} key={post.id}>
              <div className={styles.tableCell}>{post.questionId}</div>
              <div className={styles.tableCell}>
                {post.author.toLowerCase() === "unknown" ? "-" : post.author}
              </div>
              <div
                className={`${styles.tableCell} ${styles.cellContent}`}
                onClick={() => onTitleClick(post)}
              >
                {post.title}
              </div>
              <div className={styles.tableCell}>
                {formatDate(post.createdAt)}
              </div>
              <div className={styles.tableCell}>{post.views}</div>
            </div>
          ))
        ) : (
          <div className={styles.noPosts}>작성된 게시글이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default PostList;
