import React, { useState, useEffect, useCallback } from "react";
import styles from "./WelfareList.module.css";
import WelfareListHeader from "./WelfareListHeader";
import WelfareBox from "./WelfareBox";
import FilterComponent from "./FilterComponent";

const WelfareList = () => {
  const [filters, setFilters] = useState({
    userType: "",
    applicationMethod: "",
    serviceFields: []
  });

  const [welfareItems, setWelfareItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [layout, setLayout] = useState("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWelfareItems = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams({
      "user-type": filters.userType || "",
      "application-method": filters.applicationMethod || "",
      "service-field": filters.serviceFields.join(","),
      page: page.toString(),
      size: itemsPerPage.toString()
    });

    const apiUrl = `/api/proxy/main?${query.toString()}`;

    try {
      console.log("Fetching data for:", apiUrl);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API 응답 데이터:", data);

      if (data.data && data.data.content) {
        setWelfareItems(data.data.content);
        setTotalItems(data.data.totalElements);
      } else {
        console.error("잘못된 응답 형식:", data);
        setError("데이터 형식이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Failed to fetch welfare items", error);
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, itemsPerPage, page]);

  useEffect(() => {
    fetchWelfareItems();
  }, [fetchWelfareItems]);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  }, [totalItems, itemsPerPage]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage <= 0 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div>
      <FilterComponent onFilterChange={handleFilterChange} />
      <WelfareListHeader
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={handleItemsPerPageChange}
        layout={layout}
        setLayout={setLayout}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <div
          className={
            layout === "grid"
              ? styles.welfareListContainer
              : styles.welfareListContainerList
          }
        >
          {welfareItems.length > 0 ? (
            welfareItems.map((item, index) => (
              <WelfareBox
                key={`welfare-${index}-${item.serviceName}`}
                item={item}
                layout={layout}
                index={index}
              />
            ))
          ) : (
            <p>복지 혜택이 없습니다.</p>
          )}
        </div>
      )}
      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(page - 1)}
          className={styles.pageButton}
          disabled={page === 1}
        >
          이전
        </button>

        <span>
          페이지 {page} / {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(page + 1)}
          className={styles.pageButton}
          disabled={page === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default WelfareList;
