import React,{useEffect, useState} from 'react'
import Navbar from './Navbar'
import {Outlet} from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';

function Layout() {
 const [header, setHeader] = useState(null);
const [footer, setFooter] = useState(null);
const [loading, setLoading] = useState(true);
 useEffect(() => {
  async function fetchData() {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/home/read');
      const data = response.data.data[0];
      setHeader(data.header);
      setFooter(data.footer);
    } catch (error) {
      console.error('Error fetching layout data:', error);
    }finally{
      setLoading(false);
    }
  }

  fetchData();
}, []);
if (loading) return <div>Loading layout...</div>;
  return (
    <>
    <Navbar header={header}/>
    <Outlet/>
    <Footer footer={footer}/>
    </>
  )
}

export default Layout
