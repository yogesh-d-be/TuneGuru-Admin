// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../Navbar/nav.css'
// import { assests } from "../../assests/assests";

// function List(){

//     const API = "http://localhost:3420";
//     const [list, setList] = useState([]);
//     const [show,setShow] = useState("")
//     const toggle = (opt) =>{
//        setShow(show=>(show===opt?"":opt))
//     }

//     const fetchList = async () =>{
//         const response = await axios.get(`${API}/api/homeservice/list`);
        
//         if(response.data.success){
//             setList(response.data.data);
//         }
//         else{
//             toast.error("Error");
//         }
//     }

//     const removeService = async (serviceId) =>{
//         const response = await axios.post(`${API}/api/homeservice/remove`,{id:serviceId})
//         await fetchList();

//         if(response.data.success){
//             toast.success(response.data.message)
//         }
//         else{
//             toast.error("Error")
//         }
//     }

//     useEffect(()=>{
//         fetchList();
//     },[])

//     const serviceList= (type,category)=>{
//         return list.filter(service => service.serviceType=== type && service.
//             c_category===category).map((service,index)=>(
//                 <div key={index} className="items-center gap-2 px-3 py-4 border border-gray-400 list-detail" >
//                             <img src={`${API}/images/`+service.image} alt="service" className="w-12"/>
//                             <p className="max-sm:text-sm">{service.serviceName}</p>
//                             <p className="max-sm:text-sm">{service.serviceType}</p>
//                             <p className="max-sm:text-sm">&#x20B9;{service.price}</p>
//                             <img onClick={()=>removeService(service._id)} src={assests.remove} alt="delete" className="w-6 cursor-pointer"/>
//                         </div>
//             ))
//     }
    
//     return(
//         <>
//          <ToastContainer />
//             <div className="w-[85%] ml-[7%]">
//             <h1>Appliances</h1>

//                 <div className="items-center gap-2 px-3 py-4 border border-gray-400 list-detail title">
//                     <b>Image</b>
//                     <b>Service Name</b>
//                     <b>Service Type</b>
//                     <b>Price</b>
//                     <b>Action</b>
//                 </div>
//                 <div>
//                     <h1>Split AC</h1>
//                     <div onClick={()=>toggle('app')}>
//                        { show === 'app' ? <span>&lt;</span> : <span>&gt;</span>}

//                     </div>
//                     <div onClick={()=>toggle('ap')}>
//                        { show==='ap' ? <span>&lt;</span> : <span>&gt;</span>}

//                     </div>
//                     {serviceList("Appliances", "split")}
//                 </div>
//                 <div>
//                     <h1>Vehicle Services - Fridge</h1>
//                     {serviceList("VehicleServices", "Fridge")}
//                 </div>
//             </div>
//         </>
//     )
// }

// export default List;

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// FontAwesome icons import
import {faCircleUp,faCircleDown } from '@fortawesome/free-solid-svg-icons';
import '../Navbar/nav.css';
import { assests } from "../../assests/assests";

function List({API}) {
  // const API = "http://localhost:3420";
  const [list, setList] = useState([]);
  const [show, setShow] = useState("");

  const toggle = (opt) => {
    setShow(show => (show === opt ? "" : opt));
  }

  const fetchList = useCallback( async () => {
    try {
      const response = await axios.get(`${API}/api/homeservice/list`);
      if (response.data.success) {
        setList(response.data.data);
        console.log(response.data.data)
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Error fetching list");
    }
  },[API]);

  const removeService = async (serviceId) => {
    try {
      const response = await axios.post(`${API}/api/homeservice/remove`, { id: serviceId });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error removing service");
      }
    } catch (error) {
      toast.error("Error removing service");
    }
  }

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const serviceList = (heading, header, type, category) => (
    <div>
        <div className="flex justify-between w-[80%] pr-4 py-3 bg-blue-400 pl-3 rounded-lg max-[830px]:w-[97%]" onClick={() => toggle(header)}>
         <h2 className="cursor-pointer font-semibold text-lg">{header}</h2>
      <div onClick={() => toggle(header)} className="cursor-pointer">{show === header ? <span onClick={() => toggle(header)} className="cursor-pointer"><FontAwesomeIcon icon={faCircleDown} /></span> : <span onClick={() => toggle(header)} className="cursor-pointer"><FontAwesomeIcon icon={faCircleUp} /></span>}</div>
      </div>
      {show === header && (
    <table className="border border-black w-[80%] mt-4 max-[450px]:mr-3 max-[830px]:w-[97%] table-auto">
        <thead className="border border-black " >
            <tr>
                  <th className="border border-black py-3">Image</th>
                  <th className="border border-black py-3">Service Name</th>
                  <th className="border border-black py-3">Service Type</th>
                  <th className="border border-black py-3 sm:table-cell">Price</th>
                  <th className="border border-black py-3 hidden sm:table-cell">Action</th>
            </tr>
        </thead>
        <tbody className="border border-black ">
            { list
      .filter(service => service.serviceType === type && service.c_category === category)
      .map((service, index) => (
        <tr key={index} className="border border-black ">
          <td className="border border-black py-1"><div className="flex justify-center items-center"><img src={`${API}/images/${service.image}`} alt="service" className="w-12 h-12" /></div></td>
          <td className="border border-black py-1"><div className="flex justify-center items-center max-[480px]:items-start max-[480px]:justify-start max-[480px]:ml-2"><p className="max-sm:text-sm">{service.serviceName}</p></div></td>
          <td className="border border-black py-1 "><div className="flex justify-center items-center"><p className="max-sm:text-sm">{service.serviceType}</p></div></td>
          <td className="border border-black py-1  sm:hidden "><div className="flex flex-col justify-center items-center "><p className="text-sm sm:text-base font-semibold">&#x20B9;{service.price}</p><img onClick={() => removeService(service._id)} src={assests.remove} alt="delete" className="w-6 cursor-pointer" /></div></td>
          <td className="border border-black py-1  hidden sm:table-cell"><div className="flex justify-center items-center "><p className="text-sm sm:text-base font-semibold">&#x20B9;{service.price}</p></div></td>
          <td className="border border-black py-1  hidden  sm:table-cell"><div className="flex justify-center items-center "><img onClick={() => removeService(service._id)} src={assests.remove} alt="delete" className="w-6 cursor-pointer" /></div></td>
        </tr>
      ))
    }
        </tbody>
    </table>
  )}
  </div>
  )

  return (
    <>
      <ToastContainer />
      <div className="w-[85%] ml-[7%]">
        <h1 className="font-bold text-2xl mt-4">All Services</h1>
        <h1 className="font-semibold text-xl mt-4">Appliances</h1>
        <div className="mt-4">
        {serviceList('','Split Ac','Appliances','split')}
        </div>
        <div className="mt-4">
        {serviceList('','Window Ac','Appliances','window')}
        </div>
      </div>
    </>
  );
}

export default List;
