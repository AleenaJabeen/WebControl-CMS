import React,{useEffect,useState} from 'react'
import Banner from './Banner';
import axios from 'axios';
import Director from './Director';

function Home() {
    const [banner,setBanner]=useState(null);
    const [director,setDirector]=useState(null);
    const [loading, setLoading] = useState(true);
 useEffect(() => {
  async function fetchData() {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/home/read');
      const data = response.data.data[0];
      console.log(data.header)
       document.title = data.header.title;
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = `http://localhost:8080${data.header.favicon}`;
      setBanner(data.banner);
      setDirector(data.director);
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
    <div>
        <Banner banner={banner}/>
        <Director director={director}/>
    </div>
  )
}

export default Home
