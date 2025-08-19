import React,{useEffect,useState} from 'react'
import axios from 'axios';
import Banner from '../about/Banner'
import Memories from './Memories';

function LifeAt() {
      const [banner,setBanner]=useState(null);
      const [memories,setMemories]=useState(null);
        const [loading, setLoading] = useState(true);
    useEffect(() => {
  async function fetchData() {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/life/read');
      const data = response.data.data;
      console.log(data)
      setBanner(data.lifeImage)
      setMemories(data.memories)

    } catch (error) {
      console.error('Error fetching layout data:', error);
    }finally{
      setLoading(false);
    }
  }

  fetchData();
}, []);

  return (
    <div>
        <Banner banner={banner} text="Life At"/>

       <Memories memories={memories}/>
    
      
    </div>
  )
}

export default LifeAt
