import React,{useState,useEffect} from 'react'
import Banner from '../about/Banner';
import axios from 'axios';
import CareerForm from './CareerForm';
import Jobs from './Jobs';

function Career() {
    const [banner,setBanner]=useState(null);
    const [careerForm,setCareerForm]=useState(null);
     const [jobs,setJobs]=useState(null);
    const [loading, setLoading] = useState(true);
   
 useEffect(() => {
  async function fetchData() {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/career/read');
      const data = response.data.data[0];
      console.log(data)
      setBanner(data.careerImage);
      setCareerForm(data.fields);
      setJobs(data.jobs);

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
        <Banner text="Career" banner={banner}/>
        <Jobs jobs={jobs}/>
        <CareerForm careerForm={careerForm}/>
        
      
    </div>
  )
}

export default Career
