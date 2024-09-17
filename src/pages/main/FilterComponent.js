import React, { useState, useEffect } from "react";
import styles from "./FilterComponent.module.css";

const FilterComponent = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    userType: "",
    applicationMethod: "",
    serviceFields: [],
  });

  const [filterOptions, setFilterOptions] = useState({
    userTypes: [],
    applicationMethods: [],
    serviceFields: [],
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const env = process.env.REACT_APP_ENV || "development";
        const apiUrl =
          env === "production"
            ? `${process.env.REACT_APP_PROXY_URL}/main/target-list`
            : `${process.env.REACT_APP_BACKEND_URL}/main/target-list`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch filter options");
        }
        const data = await response.json();
        console.log("Filter API Response:", data);
        setFilterOptions({
          userTypes: data.data.userType || [],
          applicationMethods: data.data.applicationMethod || [],
          serviceFields: data.data.serviceFiled || [],
        });
      } catch (error) {
        console.error("Failed to fetch filter options", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleUserTypeChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      userType: e.target.value,
    }));
  };

  const handleApplicationMethodChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      applicationMethod: e.target.value,
    }));
  };

  const handleServiceFieldChange = (field) => {
    setFilters((prev) => {
      const newFields = prev.serviceFields.includes(field)
        ? prev.serviceFields.filter((f) => f !== field)
        : [...prev.serviceFields, field];
      return { ...prev, serviceFields: newFields };
    });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFilterApply = () => {
    onFilterChange(filters);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label>사용자 구분</label>
          <select onChange={handleUserTypeChange} value={filters.userType}>
            <option value="">전체</option>
            {filterOptions.userTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>신청 방법</label>
          <select
            onChange={handleApplicationMethodChange}
            value={filters.applicationMethod}
          >
            <option value="">전체</option>
            {filterOptions.applicationMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>서비스 분야</label>
          <div className={styles.dropdown}>
            <button
              onClick={handleDropdownToggle}
              className={styles.dropdownButton}
            >
              {filters.serviceFields.length > 0
                ? filters.serviceFields.join(", ")
                : "선택"}
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownContent}>
                {filterOptions.serviceFields.map((field) => (
                  <div key={field} className={styles.dropdownItem}>
                    <input
                      type="checkbox"
                      value={field}
                      checked={filters.serviceFields.includes(field)}
                      onChange={() => handleServiceFieldChange(field)}
                    />
                    <label>{field}</label>
                  </div>
                ))}
                <div className={styles.dropdownDivider}></div>
                <div className={styles.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={
                      filters.serviceFields.length ===
                      filterOptions.serviceFields.length
                    }
                    onChange={() => {
                      if (
                        filters.serviceFields.length ===
                        filterOptions.serviceFields.length
                      ) {
                        setFilters((prev) => ({ ...prev, serviceFields: [] }));
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          serviceFields: filterOptions.serviceFields,
                        }));
                      }
                    }}
                  />
                  <label>전체선택</label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.filterGroupButton}>
          <button onClick={handleFilterApply} className={styles.applyButton}>
            적용하기
          </button>
        </div>
      </div>

      <div className={styles.selectedFilters}>
        <span>
          선택된 필터 (
          {filters.userType ||
            filters.applicationMethod ||
            filters.serviceFields.length}
          )
        </span>
        <div className={styles.selectedFilterList}>
          {filters.userType && (
            <div className={styles.selectedFilterItem}>{filters.userType}</div>
          )}
          {filters.applicationMethod && (
            <div className={styles.selectedFilterItem}>
              {filters.applicationMethod}
            </div>
          )}
          {filters.serviceFields.map((field, index) => (
            <div key={index} className={styles.selectedFilterItem}>
              {field}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
