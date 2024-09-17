import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import detailData from "./merged_output.json"; // JSON 파일 import

const Detail = () => {
  const { serviceName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Received serviceName:", decodeURIComponent(serviceName));
        console.log("Detail Data:", detailData);
  
        if (detailData && detailData.data && Array.isArray(detailData.data)) {
          const serviceData = detailData.data.find(item => 
            item.서비스명 && 
            item.서비스명.toLowerCase().replace(/\s/g, '') === 
            decodeURIComponent(serviceName).toLowerCase().replace(/\s/g, '')
          );
  
          if (serviceData) {
            setData(serviceData);
            console.log("Found service data:", serviceData);
          } else {
            console.error("Service not found");
            console.log("Available services:", detailData.data.map(item => item.서비스명).filter(Boolean));
          }
        } else {
          console.error("Invalid data structure");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Service not found. Please check the service name and try again.</div>;
  }

  return (
    <div>
      <h1>서비스 상세 정보</h1>
      <p>서비스명: {data.서비스명}</p>
      <p>서비스 목적 요약: {data.서비스목적요약}</p>
      <h2>전체 데이터:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Detail;
