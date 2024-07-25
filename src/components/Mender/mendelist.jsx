import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { Modal, Form, Input  } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { assests } from "../../assests/assests";

function MenderList({ API }) {
    const [menderList, setMenderList] = useState([]);
    const [filteredMender, setFilteredMender] = useState([]);
    const [filterOption, setFilterOption] = useState("all");
    const [searchNumber, setSearchNumber] = useState("");
    const [editMender, setEditMender] = useState({
        _id: "",
        name: "",
        mobileNumber: "",
        emailId: "",
        currentAddress: "",
        expertise: "",
        experience: "",
        profilePicture: null,
        aadhaar: null,
        pancard: null,
        bank: null,
        status: "login"
    });

  const [tab, setTab] = useState("login");

  
  const [filteredLogout, setFilteredLogout] = useState([]);
  const [filterLogoutOption, setFilterLogoutOption] = useState("all")
  const [logoutSearchNumber, setLogoutSearchNumber] = useState("");

  
  const [filteredInactiveMender, setFilteredInactiveMender] = useState([]);
  const [filterInactiveoption, setFilterInactiveOption] = useState("all");
  const [inactiveSearchNumber, setInactiveSearchNumber] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.submit();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const fetchMenderData = useCallback(async () => {
        try {
            const response = await axios.get(`${API}/api/mender/listmender`);
            if (response.status === 200) {
                const sortedMenderList = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setMenderList(sortedMenderList);
                filterMender(sortedMenderList, filterOption, searchNumber);
                filterLogout(sortedMenderList, filterLogoutOption, logoutSearchNumber );
                filterInactiveMender(sortedMenderList, filterInactiveoption, inactiveSearchNumber);
                console.log(sortedMenderList);
            } else {
                toast.error("Error during fetching mender data");
            }
        } catch (error) {
            toast.error("Error during fetching mender data");
        }
    }, [API,filterInactiveoption,filterLogoutOption,filterOption,inactiveSearchNumber,logoutSearchNumber, searchNumber]);

    useEffect(() => {
        fetchMenderData();
        const interval = setInterval(fetchMenderData,60000);
        return ()=>clearInterval(interval);
    }, [fetchMenderData]);

    useEffect(() => {
        filterMender(menderList, filterOption, searchNumber);
    }, [filterOption, searchNumber, menderList]);

    useEffect(()=>{
        filterLogout(menderList, filterLogoutOption, logoutSearchNumber);
    },[filterLogoutOption, logoutSearchNumber, menderList]);

    useEffect(()=>{
        filterInactiveMender(menderList, filterInactiveoption, inactiveSearchNumber);
    },[filterInactiveoption, inactiveSearchNumber, menderList]);

    const filterMender = (allMender, option, number) => {
        let filtered = allMender.filter((mender)=>mender.status === 'login');

        if(option === "all"){

        }
        else if (option === "number" && number) {
            filtered = filtered.filter(mender => String(mender.mobileNumber).includes(String(number)));
        }
        setFilteredMender(filtered);
    };

    const filterLogout = (allMender, option, number) => {
        let filtered = allMender.filter((mender)=> mender.status === 'logout');

        if(option === "all"){

        }
        else if (option === "number" && number) {
            filtered = filtered.filter(mender => String(mender.mobileNumber).includes(String(number)));
        }
        setFilteredLogout(filtered);
    };

    const filterInactiveMender = (allMender, option, number) => {
        let filtered = allMender.filter((mender)=> mender.accountStatus === 'inactive' );

        if(option === "all"){

        }
        else if (option === "number" && number) {
            filtered = filtered.filter(mender => String(mender.mobileNumber).includes(String(number)));
        }
        setFilteredInactiveMender(filtered);
    };

    const handleFilterMender = (option) => {
        setFilterOption(option);
    };

    const handleFilterLogout = (option) => {
        setFilterLogoutOption(option);
    };

    const handleFilterInactive = (option) => {
        setFilterInactiveOption(option);
    };

    const handleSearchNumber = (event) => {
        setSearchNumber(event.target.value);
    };

    const handleLogOutSearchNumber = (event) => {
        setLogoutSearchNumber(event.target.value);
    };

    const handleInactiveSearchNumber = (event) => {
        setInactiveSearchNumber(event.target.value);
    };

    const clearSearchNumber = () => {
        setSearchNumber("");
    };

    const clearLogOutSearchNumber = () => {
        setLogoutSearchNumber("");
    };

    const clearInactiveSearchNumber = () => {
        setInactiveSearchNumber("");
    };



    const handleEditClick = (mender) => {
        const expertise = Array.isArray(mender.expertise) ? mender.expertise.join(',') : '';
        setEditMender({ ...mender, expertise });
        showModal();
    };

    const handleEditChange = (event) => {
        const { name, value, files } = event.target;
        if (files && files[0]) {
            setEditMender({ ...editMender, [name]: files[0] });
        } else {
            setEditMender({ ...editMender, [name]: value });
        }
    };

  

    const handleEditSubmit = async (values) => {
        console.log(editMender); // Add this line to debug
        try {
            const formData = new FormData();
            
            for (const key in editMender) {
                if (editMender[key]) {
                    formData.append(key, editMender[key]);
                }
            }
        
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            };
            const response = await axios.put(`${API}/api/mender/editmender/${editMender._id}`, formData, config);
            if (response.status === 200) {
                toast.success("Mender data updated successfully");
                setMenderList(prev => prev.map(mender => mender._id === editMender._id ? response.data : mender));
                fetchMenderData();
                setIsModalOpen(false);
            } else {
                toast.error("Error updating mender data");
            }
        } catch (error) {
            toast.error("Error updating mender data");
        }
    };

    const handleInactive = async (mender) => {
        try {
            const response = await axios.post(`${API}/api/mender/inactivemender/${mender._id}`);
            if (response.status === 200) {
               
                setMenderList(prev => prev.filter(m => m._id !== mender._id));
                setFilteredMender(prev => prev.filter(m => m._id !== mender._id));
                setTab("inactive");
                fetchMenderData();
                toast.success("Mender Data Removed");
            } else {
                toast.error("Error removing mender data");
            }
        } catch (error) {
            toast.error("Error removing mender data");
        }
    };

    const handleActivate = async(mender) =>{
        try{
            const response = await axios.post(`${API}/api/mender/activemender/${mender._id}`);
            if(response.status === 200){
                setMenderList(prev => prev.filter(m => m._id !== mender._id));
                setFilteredMender(prev => prev.filter(m => m._id !== mender._id));
                setTab("login")
                fetchMenderData();
                toast.success("Mender Activated")
            }
            else {
                toast.error("Error during activate mender");
            }
        } catch (error) {
            toast.error("Error during activate mender");
        }
        }

    const handleLogOut = async(mender) =>{
        try{
            const response = await axios.post(`${API}/api/mender/logoutmender/${mender._id}`);
            if(response.status === 200){
                setMenderList(prev => prev.filter(m => m._id !== mender._id));
                setFilteredMender(prev => prev.filter(m => m._id !== mender._id));
                setTab("logout")
                fetchMenderData();
                toast.success("Mender Logout")
            }
            else {
                toast.error("Error during logout mender");
            }
        } catch (error) {
            toast.error("Error during logout mender");
        }
        }

    const handleLogIn = async(mender) =>{
        try{
            const response = await axios.post(`${API}/api/mender/loginmender/${mender._id}`);
            if(response.status === 200){
                setMenderList(prev => prev.filter(m => m._id !== mender._id));
                setFilteredMender(prev => prev.filter(m => m._id !== mender._id));
                setTab("login");
                fetchMenderData();
                toast.success("Mender Login")
            }
            else {
                toast.error("Error during login mender");
            }
        } catch (error) {
            toast.error("Error during login mender");
        }
        }
    

    const filterOptions = [
        { value: "all", label: "All" },
        { value: "number", label: "Mobile Number" }
    ];

    const filterLogoutOptions = [
        { value: "all", label: "All" },
        { value: "number", label: "Mobile Number" }
    ];

    const filterInactiveOptions = [
        { value: "all", label: "All" },
        { value: "number", label: "Mobile Number" }
    ];

    

    return (
        <>
            <h2 className="font-bold my-6 text-2xl ml-6">Mender Lists</h2>
            <div className="flex flex-wrap mb-4 ml-6 mr-2 justify-center">
      <button onClick={()=>{setTab("login")}}  className={`px-4 py-3 mr-4 mb-3  rounded w-[210px]  font-bold ${tab === "login"? "bg-blue-900 text-white ring-2 ring-blue-900" :" text-blue-900 bg-white ring-2 ring-blue-900"}`}>LogIn</button>
      <button onClick={()=>{setTab("logout")}} className={`mb-3 px-4 py-3 mr-4  rounded w-[210px]  font-bold ${tab === "logout"? "bg-blue-900 text-white ring-blue-900 ring-2" :" text-blue-900 bg-white ring-2 ring-blue-900"}`}>LogOut</button>
      <button onClick={()=>{setTab("inactive")}} className={`mb-3 px-4 py-3 mr-4  rounded w-[210px]  font-bold ${tab === "inactive"? "bg-blue-900 text-white ring-blue-900 ring-2" :" text-blue-900 bg-white ring-2 ring-blue-900"}`}>In-Active</button>
      </div>
{tab === "login" &&(
            <div>
            <div className="mb-4 ml-14 flex items-center flex-wrap">
                <Select
                    options={filterOptions}
                    defaultValue={filterOptions[0]}
                    onChange={(option) => handleFilterMender(option.value)}
                    className="w-32 mr-4 mb-4"
                />
                {filterOption === "number" && (
                    <div>
                        <input
                            type="number"
                            value={searchNumber}
                            onChange={handleSearchNumber}
                            placeholder="Enter Mobile Number"
                            className="border p-2 rounded mb-4"
                        />
                        <button onClick={clearSearchNumber} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2 mt-0">X</button>
                    </div>
                )}
            </div>

            
                {filteredMender.length === 0 ? (
                    <div className="text-center text-gray-500">No mender data available</div>
                ) : 
               
(<>
{filteredMender.map((mender, index) => (
<div key={index} className={`${mender.accountStatus === "inactive" ? "bg-red-800":""} ${mender.status === "logout" ? "bg-red-500":""} px-8 py-8 flex relative justify-center items-center bg-green-700 w-[95%] mx-auto flex-wrap mb-10 max-[450px]:text-sm`}>
    <div className="flex items-center justify-center gap-10 flex-wrap mb-6">
        <div>
        <img src={`${API}/files/menderdata/${mender.profilePicture}`} alt="menderfile" className="w-32 h-40 rounded-lg" />
        </div>
            <div>
            <p className="font-bold text-white text-2xl mb-4">{mender.name}</p>
             <p className="font-semibold text-white">Mobile: {mender.mobileNumber}</p>
             <p className="font-semibold text-white">Email: {mender.emailId}</p>
             <p className="font-semibold text-white">Address: {mender.currentAddress}</p>
             <p className="font-semibold text-white w-full  leading-6">Expertise: {mender.expertise}</p>
             <p className="font-semibold text-white">Experience: {mender.experience}</p>
            
        </div>
    </div>

    <div className="mb-10 mt-4 pb-6 w-full">
    <h1 className="font-semibold text-lg text-white text-center mb-6">ID Card & Bank Details</h1>
         <div className="flex justify-evenly items-center gap-6 md:gap-10 mb-6 max-[600px]:flex-col max-[600px]:justify-center">
             <div className="text-center">
                 <img src={assests.aadhaar} alt="aadhaar" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.aadhaar}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">Aadhaar</a>
             </div>
             <div className="text-center">
                 <img src={assests.pancard} alt="pancard" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.pancard}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">Pancard</a>
             </div>
             <div className="text-center">
                 <img src={assests.passbook} alt="bank" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.bank}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-1  block">Bank</a>
            </div>
        </div>
    </div>

    <div className="absolute bottom-6 right-6">
    <div className="flex flex-wrap justify-center gap-4">
             <button onClick={() => handleEditClick(mender)} className="w-24 px-3 py-2 font-semibold bg-blue-500 text-white rounded hover:text-blue-500 hover:bg-white hover:ring-blue-500 transition-all ease-in-out duration-300">Edit</button>
             {mender.status === 'login' &&
                 <button onClick={() => handleLogOut(mender)} className="w-24 px-3 py-2 font-semibold bg-red-500 text-white rounded hover:text-red-500 hover:bg-white hover:ring-red-500 transition-all ease-in-out duration-300">Logout</button>
             }
             {mender.status === 'logout' &&
                 <button onClick={() => handleLogIn(mender)} className="w-24 px-3 py-2 font-semibold bg-green-500 text-white rounded hover:text-green-500 hover:bg-white hover:ring-green-500 transition-all ease-in-out duration-300">Login</button>
             }
             {mender.accountStatus === 'active' &&
                 <button onClick={() => handleInactive(mender)} className="w-24 px-3 py-2 font-semibold bg-red-800 text-white rounded hover:text-red-800 hover:bg-white hover:ring-red-800 transition-all ease-in-out duration-300">In-Active</button>
             }
             {mender.accountStatus === 'inactive' &&
                 <button onClick={() => handleActivate(mender)} className="w-24 px-3 py-2 font-semibold bg-green-800 text-white rounded hover:text-green-800 hover:bg-white hover:ring-green-800 transition-all ease-in-out duration-300">Activate</button>
             }
         </div>

         </div>
</div>
))

}
</>)
}
</div>
)}


{/* Logout tab section */}
{tab === "logout" &&(
            <div>
            <div className="mb-4 ml-14 flex items-center flex-wrap">
                <Select
                    options={filterLogoutOptions}
                    defaultValue={filterLogoutOptions[0]}
                    onChange={(option) => handleFilterLogout(option.value)}
                    className="w-32 mr-4 mb-4"
                />
                {filterOption === "number" && (
                    <div>
                        <input
                            type="number"
                            value={logoutSearchNumber}
                            onChange={handleLogOutSearchNumber}
                            placeholder="Enter Mobile Number"
                            className="border p-2 rounded mb-4"
                        />
                        <button onClick={clearLogOutSearchNumber} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2 mt-0">X</button>
                    </div>
                )}
            </div>

            
                {filteredLogout.length === 0 ? (
                    <div className="text-center text-gray-500">No mender data available</div>
                ) : 
               
(<>
{filteredLogout.map((mender, index) => (
<div key={index} className={`${mender.accountStatus === "inactive" ? "bg-red-800":""} ${mender.status === "logout" ? "bg-red-500":""} px-8 py-8 flex relative justify-center items-center bg-green-700 w-[95%] mx-auto flex-wrap mb-10 max-[450px]:text-sm`}>
    <div className="flex items-center justify-center gap-10 flex-wrap mb-6">
        <div>
        <img src={`${API}/files/menderdata/${mender.profilePicture}`} alt="menderfile" className="w-32 h-40 rounded-lg" />
        </div>
            <div>
            <p className="font-bold text-white text-2xl mb-4">{mender.name}</p>
             <p className="font-semibold text-white">Mobile: {mender.mobileNumber}</p>
             <p className="font-semibold text-white">Email: {mender.emailId}</p>
             <p className="font-semibold text-white">Address: {mender.currentAddress}</p>
             <p className="font-semibold text-white w-full  leading-6">Expertise: {mender.expertise}</p>
             <p className="font-semibold text-white">Experience: {mender.experience}</p>
            
        </div>
    </div>

    <div className="mb-10 mt-4 pb-6 w-full">
    <h1 className="font-semibold text-lg text-white text-center mb-6">ID Card & Bank Details</h1>
         <div className="flex justify-evenly items-center gap-6 md:gap-10 mb-6 max-[600px]:flex-col max-[600px]:justify-center">
             <div className="text-center">
                 <img src={assests.aadhaar} alt="aadhaar" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.aadhaar}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">Aadhaar</a>
             </div>
             <div className="text-center">
                 <img src={assests.pancard} alt="pancard" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.pancard}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">Pancard</a>
             </div>
             <div className="text-center">
                 <img src={assests.passbook} alt="bank" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.bank}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-1  block">Bank</a>
            </div>
        </div>
    </div>

    <div className="absolute bottom-6 right-6">
    <div className="flex flex-wrap justify-center gap-4">
             {/* <button onClick={() => handleEditClick(mender)} className="w-24 px-3 py-2 font-semibold bg-blue-500 text-white rounded hover:text-blue-500 hover:bg-white hover:ring-blue-500 transition-all ease-in-out duration-300">Edit</button> */}
             {mender.status === 'login' &&
                 <button onClick={() => handleLogOut(mender)} className="w-24 px-3 py-2 font-semibold bg-red-500 text-white rounded hover:text-red-500 hover:bg-white hover:ring-red-500 transition-all ease-in-out duration-300">Logout</button>
             }
             {mender.status === 'logout' &&
                 <button onClick={() => handleLogIn(mender)} className="w-24 px-3 py-2 font-semibold bg-green-500 text-white rounded hover:text-green-500 hover:bg-white hover:ring-green-500 transition-all ease-in-out duration-300">Login</button>
             }
             {mender.accountStatus === 'active' &&
                 <button onClick={() => handleInactive(mender)} className="w-24 px-3 py-2 font-semibold bg-red-800 text-white rounded hover:text-red-800 hover:bg-white hover:ring-red-800 transition-all ease-in-out duration-300">In-Active</button>
             }
             {mender.accountStatus === 'inactive' &&
                 <button onClick={() => handleActivate(mender)} className="w-24 px-3 py-2 font-semibold bg-green-800 text-white rounded hover:text-green-800 hover:bg-white hover:ring-green-800 transition-all ease-in-out duration-300">Activate</button>
             }
         </div>

         </div>
</div>
))

}
</>)
}
</div>
)}


 {/* Inactive Tab section */}

{tab === "inactive" &&(
            <div>
            <div className="mb-4 ml-14 flex items-center flex-wrap">
                <Select
                    options={filterInactiveOptions}
                    defaultValue={filterInactiveOptions[0]}
                    onChange={(option) => handleFilterInactive(option.value)}
                    className="w-32 mr-4 mb-4"
                />
                {filterOption === "number" && (
                    <div>
                        <input
                            type="number"
                            value={inactiveSearchNumber}
                            onChange={handleInactiveSearchNumber}
                            placeholder="Enter Mobile Number"
                            className="border p-2 rounded mb-4"
                        />
                        <button onClick={clearInactiveSearchNumber} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2 mt-0">X</button>
                    </div>
                )}
            </div>

            
                {filteredInactiveMender.length === 0 ? (
                    <div className="text-center text-gray-500">No mender data available</div>
                ) : 
               
(<>
{filteredInactiveMender.map((mender, index) => (
<div key={index} className={`${mender.accountStatus === "inactive" ? "bg-red-800":""} ${mender.status === "logout" ? "bg-red-500":""} px-8 py-8 flex relative justify-center items-center bg-green-700 w-[95%] mx-auto flex-wrap mb-10 max-[450px]:text-sm`}>
    <div className="flex items-center justify-center gap-10 flex-wrap mb-6">
        <div>
        <img src={`${API}/files/menderdata/${mender.profilePicture}`} alt="menderfile" className="w-32 h-40 rounded-lg" />
        </div>
            <div>
            <p className="font-bold text-white text-2xl mb-4">{mender.name}</p>
             <p className="font-semibold text-white">Mobile: {mender.mobileNumber}</p>
             <p className="font-semibold text-white">Email: {mender.emailId}</p>
             <p className="font-semibold text-white">Address: {mender.currentAddress}</p>
             <p className="font-semibold text-white w-full  leading-6">Expertise: {mender.expertise}</p>
             <p className="font-semibold text-white">Experience: {mender.experience}</p>
            
        </div>
    </div>

    <div className="mb-10 mt-4 pb-6 w-full">
    <h1 className="font-semibold text-lg text-white text-center mb-6">ID Card & Bank Details</h1>
         <div className="flex justify-evenly items-center gap-6 md:gap-10 mb-6 max-[600px]:flex-col max-[600px]:justify-center">
             <div className="text-center">
                 <img src={assests.aadhaar} alt="aadhaar" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.aadhaar}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">Aadhaar</a>
             </div>
             <div className="text-center">
                 <img src={assests.pancard} alt="pancard" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.pancard}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">Pancard</a>
             </div>
             <div className="text-center">
                 <img src={assests.passbook} alt="bank" className="w-20" />
                 <a href={`${API}/files/menderdata/${mender.bank}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-1  block">Bank</a>
            </div>
        </div>
    </div>

    <div className="absolute bottom-6 right-6">
    <div className="flex flex-wrap justify-center gap-4">
             {/* <button onClick={() => handleEditClick(mender)} className="w-24 px-3 py-2 font-semibold bg-blue-500 text-white rounded hover:text-blue-500 hover:bg-white hover:ring-blue-500 transition-all ease-in-out duration-300">Edit</button> */}
             {/* {mender.status === 'login' &&
                 <button onClick={() => handleLogOut(mender)} className="w-24 px-3 py-2 font-semibold bg-red-500 text-white rounded hover:text-red-500 hover:bg-white hover:ring-red-500 transition-all ease-in-out duration-300">Logout</button>
             }
             {mender.status === 'logout' &&
                 <button onClick={() => handleLogIn(mender)} className="w-24 px-3 py-2 font-semibold bg-green-500 text-white rounded hover:text-green-500 hover:bg-white hover:ring-green-500 transition-all ease-in-out duration-300">Login</button>
             } */}
             {mender.accountStatus === 'active' &&
                 <button onClick={() => handleInactive(mender)} className="w-24 px-3 py-2 font-semibold bg-red-800 text-white rounded hover:text-red-800 hover:bg-white hover:ring-red-800 transition-all ease-in-out duration-300">In-Active</button>
             }
             {mender.accountStatus === 'inactive' &&
                 <button onClick={() => handleActivate(mender)} className="w-24 px-3 py-2 font-semibold bg-green-800 text-white rounded hover:text-green-800 hover:bg-white hover:ring-green-800 transition-all ease-in-out duration-300">Activate</button>
             }
         </div>

         </div>
</div>
))

}
</>)
}
</div>
)}


            <Modal
                title="Edit Mender"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Save"
            >
                <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
                    <Form.Item label="Name" name="name" initialValue={editMender.name}>
                        <Input name="name" value={editMender.name} onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Mobile Number" name="mobileNumber" initialValue={editMender.mobileNumber}>
                        <Input name="mobileNumber" value={editMender.mobileNumber} onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Email ID" name="emailId" initialValue={editMender.emailId}>
                        <Input name="emailId" value={editMender.emailId} onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Current Address" name="currentAddress" initialValue={editMender.currentAddress}>
                        <Input name="currentAddress" value={editMender.currentAddress} onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Expertise" name="expertise" initialValue={editMender.expertise}>
                        <Input name="expertise" value={editMender.expertise} onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Experience" name="experience" initialValue={editMender.experience}>
                        <Input name="experience" value={editMender.experience} onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Profile Picture" name="profilePicture">
                        <Input type="file" name="profilePicture" onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Aadhaar" name="aadhaar">
                        <Input type="file" name="aadhaar" onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Pancard" name="pancard">
                        <Input type="file" name="pancard" onChange={handleEditChange} />
                    </Form.Item>
                    <Form.Item label="Bank" name="bank">
                        <Input type="file" name="bank" onChange={handleEditChange} />
                    </Form.Item>

                </Form>
            </Modal>
        </>

        
    );
    
}

export default MenderList;
