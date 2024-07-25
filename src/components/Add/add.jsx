import React, { useState } from "react";
import { assests } from "../../assests/assests";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Add({API}) {
    // const API = "http://localhost:3420";
    const [image, setImage] = useState(null);
    const [detail, setDetail] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [data, setData] = useState({
        s_id: "",
        serviceCategory: "",
        s_category: "",
        c_category: "",
        serviceName: "",
        serviceType: "",
        description: "",
        price: "",
        details: []
    });

    const onchangeHandle = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    }

    const handleAddDetail = () => {
        if (detail.trim()) {
            const updatedDetails = [...data.details];
            if (editIndex !== null) {
                updatedDetails[editIndex] = detail;
                setEditIndex(null);
            } else {
                updatedDetails.push(detail);
            }
            setData(prevData => ({ ...prevData, details: updatedDetails }));
            setDetail("");
        }
    }

    const handleEditDetail = (index) => {
        setDetail(data.details[index]);
        setEditIndex(index);
    }

    const handleDeleteDetail = (index) => {
        const updatedDetails = data.details.filter((_, i) => i !== index);
        setData(prevData => ({ ...prevData, details: updatedDetails }));
    }

    const handleClearForm = () => {
        setData({
            s_id: "",
            serviceCategory: "",
            s_category: "",
            c_category: "",
            serviceName: "",
            serviceType: "",
            description: "",
            price: "",
            details: []
        });
        setImage(null);
        setDetail("");
        setEditIndex(null);
    }

    // const validateForm = () => {
    //     const requiredFields = ["s_id", "serviceCategory", "s_category", "c_category", "serviceName", "serviceType", "description", "price"];
    //     for (let field of requiredFields) {
    //         if (!data[field]) {
    //             toast.error(`Please fill in the ${field.replace(/_/g, ' ')}`);
    //             return false;
    //         }
    //     }
    //     if (data.details.length === 0) {
    //         toast.error("Please add at least one detail");
    //         return false;
    //     }
    //     if (!image) {
    //         toast.error("Please upload an image");
    //         return false;
    //     }
    //     return true;
    // }

    const onSubmitHandle = async (event) => {
        event.preventDefault();
        
        if (!data.s_id || !data.serviceCategory || !data.s_category || !data.c_category || !data.serviceName || !data.serviceType || !data.description || !data.price || data.details.length === 0 || !image) {
            toast.error("Please fill in all the fields");
            return;
        }
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === "details") {
                data.details.forEach(detail => formData.append(key, detail));
            } else {
                formData.append(key, data[key]);
            }
        });
        formData.append("image", image);

        try {
            const response = await axios.post(`${API}/api/homeservice/add`, formData);
            if (response.data.success) {
                handleClearForm();
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("An error occurred while submitting the form");
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="ml-16 mt-12 text-gray-500 max-sm:ml-6">
                <form onSubmit={onSubmitHandle} className="flex flex-col gap-2 w-[100%] mb-20">
                    <div>
                        <p>Upload Image</p>
                        <label htmlFor="image">
                            <div className="w-[120px] h-[120px] border border-gray-200 flex justify-center items-center mt-2">
                                <img src={image ? URL.createObjectURL(image) : assests.upload} alt="upload" className="w-20" />
                            </div>
                        </label>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </div>
                    <div className="flex flex-col gap-2 max-w-[40%] min-w-[250px]">
                        <label htmlFor="id"><p>Service Id</p></label>
                        <input onChange={onchangeHandle} value={data.s_id} id="id" type="text" name="s_id" placeholder="Type here" className=" outline-none px-2 py-[5px] bg-gray-200 focus:ring-2 focus:border-blue-400" />
                    </div>
                    <div className="flex flex-col gap-2 mt-1 max-w-[40%] min-w-[250px]">
                        <label htmlFor="serviceCategory"><p>Select Service Component</p></label>
                        <select onChange={onchangeHandle} id="serviceCategory" name="serviceCategory" value={data.serviceCategory} className=" outline-none px-2 py-[5px] bg-gray-200 focus:ring-2 focus:border-blue-400" >
                            <option value="select">select</option>
                            <option value="AC">AC</option>
                            <option value="Fridge">Fridge</option>
                            <option value="Washing Machine">Washing Machine</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 max-w-[40%] min-w-[250px]">
                        <label htmlFor="name"><p>Service Name</p></label>
                        <input onChange={onchangeHandle} value={data.serviceName} id="name" type="text" name="serviceName" placeholder="Type here" className=" outline-none px-2 py-[5px] bg-gray-200 focus:ring-2 focus:border-blue-400" />
                    </div>
                    <div className="flex flex-col gap-2 max-w-[40%] min-w-[250px]">
                        <label htmlFor="description"><p className="mt-3">Service Description</p></label>
                        <textarea onChange={onchangeHandle} value={data.description} id="description" name="description" rows="6" placeholder="Write description here" className=" px-2 py-[5px] outline-none bg-gray-200 focus:ring-2 focus:border-blue-400" />
                    </div>
                    <div className="flex flex-col gap-2 max-w-[40%] min-w-[250px]">
                        <label htmlFor="details">Service Details</label>
                        <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows="2" placeholder="Add detail" className="px-2 py-[5px] bg-gray-200 outline-none focus:ring-2 focus:border-blue-400" />
                        <button type="button" onClick={handleAddDetail} className="max-w-[120px] p-2 bg-blue-900 text-white mt-2 rounded-lg">{editIndex !== null ? "Update Detail" : "Add Detail"}</button>
                        <ul>
                            {data.details.map((detail, index) => (
                                <li key={index} className="px-2 py-2 border border-gray-600 bg-gray-300 rounded-md mb-2 flex justify-between items-center focus:ring-2 focus:border-blue-400">
                                    <span>{`${index + 1}. ${detail}`}</span>
                                    <div>
                                        <button type="button" onClick={() => handleEditDetail(index)} className="text-blue-500 mr-2 ">Edit</button>
                                        <button type="button" onClick={() => handleDeleteDetail(index)} className="text-red-500">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-wrap mr-4 ">
                        <div className="flex flex-col gap-2 mr-12 max-[400px]:mb-3">
                            <label htmlFor="s_category"><p>Select Service</p></label>
                            <select onChange={onchangeHandle} id="s_category" name="s_category" value={data.s_category} className="max-w-[120px] p-2 bg-gray-200 outline-none focus:ring-2 focus:border-blue-400 ">
                                <option value="select">select</option>
                                <option value="service">Service</option>
                                <option value="repair">Repair</option>
                                <option value="install">Installation & Uninstallation</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="c_category"><p>Component Type</p></label>
                            <select onChange={onchangeHandle} id="c_category" name="c_category" value={data.c_category} className="max-w-[120px] p-2 bg-gray-200 outline-none focus:ring-2 focus:border-blue-400">
                                <option value="select">select</option>
                                <option value="split">Split</option>
                                <option value="window">Window</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap mr-4">
                        <div className="flex flex-col gap-2 mr-12 max-[400px]:mb-3 max-[400px]:mt-3">
                            <label htmlFor="serviceType"><p className="mt-3 max-[400px]:mt-0">Service Category</p></label>
                            <select onChange={onchangeHandle} id="serviceType" name="serviceType" value={data.serviceType} className="max-w-[120px] p-2 bg-gray-200 outline-none focus:ring-2 focus:border-blue-400">
                                <option value="select">select</option>
                                <option value="Appliances">Appliances</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Carpenter">Carpenter</option>
                                <option value="DeviceServices">Device Services</option>
                                <option value="CleaningServices">Cleaning Services</option>
                                <option value="PestControl">Pest Control</option>
                                <option value="VehicleServices">Vehicle Services</option>
                                <option value="WaterPurifier">Water Purifier</option>
                                <option value="painting">Painting</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 ">
                            <label htmlFor="price"><p className="mt-3 max-[400px]:mt-0">Service Price</p></label>
                            <input onChange={onchangeHandle} value={data.price} id="price" type="number" name="price" placeholder="Price" className="bg-gray-200 outline-none max-w-[120px] p-2 focus:ring-2 focus:border-blue-400" />
                        </div>
                    </div>
                    <div className="flex gap-4 ">
                    <button type="button" onClick={handleClearForm} className="mt-4 max-w-[150px] p-2 bg-red-600 text-white rounded-lg w-24">CLEAR</button>
                    <button type="submit" className="mt-4 max-w-[150px] p-2 bg-blue-900 text-white rounded-lg w-24">ADD</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Add;
