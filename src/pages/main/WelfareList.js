import React, { useState, useEffect, useCallback } from "react";
import styles from "./WelfareList.module.css";
import WelfareListHeader from "./WelfareListHeader";
import WelfareBox from "./WelfareBox";
import FilterComponent from "./FilterComponent";

const WelfareList = () => {
  const [filters, setFilters] = useState({
    userType: "",
    applicationMethod: "",
    serviceFields: [],
  });

  const [welfareItems, setWelfareItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [layout, setLayout] = useState("grid");

  const fetchWelfareItems = useCallback(async () => {
    const query = new URLSearchParams({
      "user-type": filters.userType || "",
      "application-method": filters.applicationMethod || "",
      "service-field": filters.serviceFields.join(","),
      page: page.toString(),
      size: itemsPerPage.toString(),
    });

    try {
      const env = process.env.REACT_APP_ENV || "development";
      const apiUrl =
        env === "production"
          ? `${process.env.REACT_APP_PROXY_URL}/main?${query.toString()}`
          : `${process.env.REACT_APP_BACKEND_URL}/main?${query.toString()}`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("API 응답 데이터:", data);
      setWelfareItems(data.data.content);
      setTotalItems(data.data.totalElements);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch welfare items", error);
    }
  }, [filters, page, itemsPerPage]);

  useEffect(() => {
    fetchWelfareItems();
  }, [fetchWelfareItems]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setPage(0);
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

      <div
        className={
          layout === "grid"
            ? styles.welfareListContainer
            : styles.welfareListContainerList
        }
      >
        {welfareItems.length > 0 ? (
          welfareItems.map((item, index) => (
            <WelfareBox key={index} item={item} layout={layout} />
          ))
        ) : (
          <p>복지 혜택이 없습니다.</p>
        )}
      </div>

      <div className={styles.pagination}>
        {page > 0 && (
          <button
            onClick={() => setPage(page - 1)}
            className={styles.pageButton}
          >
            이전
          </button>
        )}
        <span>
          페이지 {page + 1} / {totalPages}
        </span>
        {page < totalPages - 1 && (
          <button
            onClick={() => setPage(page + 1)}
            className={styles.pageButton}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default WelfareList;
