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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWelfareItems = useCallback(async (pageToFetch, itemsToFetch) => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams({
      "user-type": filters.userType || "",
      "application-method": filters.applicationMethod || "",
      "service-field": filters.serviceFields.join(","),
      page: pageToFetch.toString(),
      size: "24", // 백엔드에서 항상 24개를 반환한다고 가정
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

      if (data.data && Array.isArray(data.data.content)) {
        return {
          items: data.data.content,
          totalElements: data.data.totalElements,
          totalPages: data.data.totalPages,
        };
      } else {
        throw new Error("데이터 형식이 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Failed to fetch welfare items", error);
      throw error;
    }
  }, [filters]);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const pagesToFetch = Math.ceil(itemsPerPage / 24);
      let allItems = [];
      let totalElements = 0;
      let totalPages = 0;

      for (let i = 0; i < pagesToFetch; i++) {
        const result = await fetchWelfareItems(page + i, 24);
        allItems = [...allItems, ...result.items];
        totalElements = result.totalElements;
        totalPages = result.totalPages;

        if (allItems.length >= itemsPerPage) break;
      }

      setWelfareItems(allItems.slice(0, itemsPerPage));
      setTotalItems(totalElements);
      setTotalPages(Math.ceil(totalElements / itemsPerPage));
    } catch (error) {
      setError("데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchWelfareItems, page, itemsPerPage]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;
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
            <p>현재 조건에 맞는 복지 혜택이 없습니다.</p>
          )}
        </div>
      )}
      <div className={styles.pagination}>
        {page > 0 && (
          <button
            onClick={() => handlePageChange(page - 1)}
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
            onClick={() => handlePageChange(page + 1)}
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