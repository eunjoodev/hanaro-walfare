import React, { useState, useEffect } from "react";
import styles from "./FilterComponent.module.css";

const FilterComponent = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    userType: "",
    applicationMethod: "",
    serviceFields: []
  });

  const [filterOptions, setFilterOptions] = useState({
    userTypes: [],
    applicationMethods: [],
    serviceFields: []
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // 환경변수에 따라 다른 프록시 및 백엔드 URL 사용
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
          serviceFields: data.data.serviceFiled || []
        });
      } catch (error) {
        console.error("Failed to fetch filter options", error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleUserTypeChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      userType: e.target.value
    }));
  };

  const handleApplicationMethodChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      applicationMethod: e.target.value
    }));
  };

  const handleServiceFieldChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => {
      const newFields = prev.serviceFields.includes(value)
        ? prev.serviceFields.filter((field) => field !== value)
        : [...prev.serviceFields, value];
      return { ...prev, serviceFields: newFields };
    });
  };

  return (
    <div className={styles.filterContainer}>
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
        {filterOptions.serviceFields.map((field) => (
          <div key={field}>
            <input
              type="checkbox"
              value={field}
              checked={filters.serviceFields.includes(field)}
              onChange={handleServiceFieldChange}
            />
            {field}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterComponent;