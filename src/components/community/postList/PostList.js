import styles from "./PostList.module.css";

function PostList({
  data,
  currentPage,
  postsPerPage,
  totalPosts,
  onTitleClick,
}) {
  const startingNumber = totalPosts - (currentPage - 1) * postsPerPage;

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
          data.map((post, index) => (
            <div className={styles.tableRow} key={post.id}>
              <div className={styles.tableCell}>{startingNumber - index}</div>
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
                {new Date(post.createdAt).toLocaleDateString()}
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
