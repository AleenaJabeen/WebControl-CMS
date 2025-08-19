import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import About from './components/about/About';
import Services from './pages/Services';
import Career from './pages/Career';
import LifeAt from './pages/LifeAt';
import Contact from './pages/Contact';


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
   <Route path='/' element={<Layout/>}>
   <Route index element={<Home/>}/>
    <Route path='/aboutus' element={<About/>}/>
    <Route path='/services' element={<Services/>}/>
     <Route path='/career' element={<Career/>}/>
      <Route path='/lifeat' element={<LifeAt/>}/>
        <Route path='/contact' element={<Contact/>}/>

   </Route>
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
