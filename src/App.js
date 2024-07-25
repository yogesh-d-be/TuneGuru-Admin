import React from "react";
import Navbar from "./components/Navbar/navbar";
import Sidebar from "./components/Navbar/sidebar";
import { Route, Routes } from "react-router-dom";
import List from "./components/List/list";
import Add from "./components/Add/add";
import Booking from "./components/Booking/booking";
import Home from "./components/Home";
import Contact from "./components/Contact form/contact";
import MenderList from "./components/Mender/mendelist";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // const API = "http://localhost:3420";
  const API = "https://backend-kg0v.onrender.com";

  return (
    <>
      <Navbar />
      <div className="flex">
        
      <Sidebar />
      
      <div className="w-[80%] ">
          <Routes>
          <Route path="/" element={<Home/>}/>
            <Route path="/addservice" element={<Add API={API}/> } />
            <Route path="/listservice" element={<List API={API}/>} />
            <Route path="/bookings" element={<Booking API={API}/>} />
            <Route path="/contactform" element={<Contact API={API}/>} />
            <Route path="/menderlist" element={<MenderList API={API}/>} />

          </Routes>
        </div>
        </div>
        <ToastContainer />
    </>
  );
}

export default App;
