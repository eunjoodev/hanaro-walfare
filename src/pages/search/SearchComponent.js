import React, { useState, useEffect, useRef } from 'react';
import styles from './Search.module.css';
import Papa from 'papaparse';
import { useLocation } from 'react-router-dom';

function SearchComponent() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(20); // Number of posts initially visible
  const loader = useRef(null);

  const location = useLocation();

  useEffect(() => {
    Papa.parse('./news.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setCsvData(result.data.map(item => ({
          ...item,
          title: item.title || item.서비스명 || "No Title",
        })));
      },
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let benefitData;

        if (location.state && location.state.benefitData) {
          benefitData = location.state.benefitData;
        } else {
          const detailDataFiles = ['detaildata1', 'detaildata2', 'detaildata3', 'detaildata4'];
          const detailDataModules = await Promise.all(
            detailDataFiles.map(file => import(`./${file}.json`))
          );

          const allData = detailDataModules.flatMap(module => module.default.data || []);
          setApiData(allData.map(item => ({
            ...item,
            title: item.title || item.서비스명 || "No Title",
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [location]);

  const combinedData = [...csvData, ...apiData];
  const filteredData = combinedData.filter(item =>
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (item.서비스명 && item.서비스명.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 20); // Load more posts
      }
    }, { threshold: 1 });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles['search-container']}>
      <h1>통합검색</h1>
      <p>복지로의 통합자료를 만날 수 있습니다.</p>

      <div className={styles['search-bar']}>
        <select>
          <option>전체</option>
        </select>
        <input 
          type="text" 
          placeholder="통합검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input type="date" />
        <input type="date" />
        <button onClick={() => setSearchTerm(searchTerm)}>검색</button>
        <label>
          <input type="checkbox" /> 결과 내 재검색
        </label>
      </div>

      <div className={styles['popular-searches']}>
        <h2>주간 인기 검색어</h2>
        <ul>
          {['청년월세', '주거급여', '차상위계층'].map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('all')} className={activeTab === 'all' ? styles.active : ''}>
          전체 ({filteredData.length})
        </button>
      </div>

      {activeTab === 'all' && (
        <div className={styles['content-box']}>
          {filteredData.slice(0, visiblePosts).map((item, index) => (
            <div key={index} className={styles['news-item']}>
              <h3>{item.title || item.서비스명}</h3>
              <p>{item.description}</p>
              {item.date && <span>작성일: {item.date}</span>}
            </div>
          ))}
        </div>
      )}

      <div ref={loader} />
    </div>
  );
}

export default SearchComponent;
