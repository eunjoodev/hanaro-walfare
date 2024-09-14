import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainBanner from './MainBanner';
import KeyBenefits from './KeyBenefits';
import QuickFind from './QuickFind';
import WelfareList from './WelfareList';
import ChatWidget from './ChatWidget';

const Main = () => {
  const [data, setData] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL || '/api';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/endpoint`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [apiUrl]);

  return (
    <>
      <main>
        <MainBanner />
        <KeyBenefits />
        <QuickFind />
        <WelfareList data={data} />
        <ChatWidget />
      </main>
    </>
  );
};

export default Main;