import React,{useEffect,useState} from 'react'
import axios from 'axios';
import Banner from './Banner';
import Innovative from './Innovative';
import Partner from './Partner';

function About() {
    const [banner,setBanner]=useState(null);
    const [loading, setLoading] = useState(true);
    const [innovative,setInnovative]=useState({
        innovativeIdeas:{},
        text:"",
        description:"",
        authorPosition:"",
        header:"",
        experienceYears:null,
        awards:null,
        project:null,
        author:"",
        aboutImage:null
    });
    const [partner,setPartner]=useState({
        header:"",
        description:""
        ,images:[]
    })
 useEffect(() => {
  async function fetchData() {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/about/read');
      const data = response.data.data[0];
      console.log(data)
      setBanner(data.aboutBannerImage);
      setPartner({
header:data.partnerHeader,
        description:data.partnerDescription,
        images:data.partnerImages
      })
      setInnovative({
        innovativeIdeas:data.innovativeIdeas,
        text:data.innovativeSmallText,
        description:data.innovativeDescription,
        authorPosition:data.authorPosition,
        header:data.innovativeHeader,
        experienceYears:data.experienceYears,
        awards:data.awards,
        project:data.projectsNumber,
        author:data.aboutAuthor,
        aboutImage:data.aboutImage
      })


     
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
    <div className='flex flex-col'>
        <Banner banner={banner} text="About"/>
        <Innovative  innovative={innovative}/>
        <Partner partner={partner}/>
      
    </div>
  )
}

export default About
