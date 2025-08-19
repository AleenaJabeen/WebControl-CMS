import React, { useState, useEffect } from "react";
import axios from "axios";
import Banner from "./Banner";
import Products from "./Products";
import Tools from "./Tools";

function Services() {
  const [banner, setBanner] = useState(null);
  const [data,setData]=useState(null)
  const [service,setServices]=useState({
    description:"",
    header:"",
    services:[]
  });
  const [tools,setTools]=useState({
    toolHeading:"",
    tools:[]
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/service/read"
        );
        const data = response.data.data[0];
        // console.log(data.servicesDescription);
        setData(data.servicesDescription)
        setBanner(data.serviceImage);
        setServices({
           description:data.servicesDescription,
    header:data.serviceHeader,
    services:data.services
        });
        setTools({
          toolHeading:data.toolHeading,
          tools:data.tools
        });
      } catch (error) {
        console.error("Error fetching layout data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

    return (
      <div className="flex flex-col">
<Banner banner={banner}/>
<Products services={service}/>
<Tools tools={tools}/>
      </div>
    );
}

export default Services;
