import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { assests } from "../../assests/assests";

function MenderList({ API }) {
    const [menderList, setMenderList] = useState([]);
    const [filteredMender, setFilteredMender] = useState([]);
    const [filterOption, setFilterOption] = useState([]);
    const [searchNumber, setSearchNumber] = useState("");
    const [isEditing, setIsEditing] = useState(false);
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
        bank: null
    });

    useEffect(() => {
        const fetchMenderData = async () => {
            try {
                const response = await axios.get(`${API}/api/mender/listmender`);
                if (response.status === 200) {
                    const sortedMenderList = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setMenderList(sortedMenderList);
                } else {
                    toast.error("Error during fetching mender data");
                }
            } catch (error) {
                toast.error("Error during fetching mender data");
            }
        };
        fetchMenderData();
    }, [API]);

    useEffect(() => {
        filterMender(menderList, filterOption, searchNumber);
    }, [filterOption, searchNumber, menderList]);

    const filterMender = (allMender, option, number) => {
        let filtered = allMender;

        if (option === "all") {
            // no filter
        } else if (option === "number" && number) {
            filtered = filtered.filter(mender => String(mender.mobileNumber).includes(String(number)));
        }
        setFilteredMender(filtered);
    };

    const handleFilterMender = (option) => {
        setFilterOption(option);
    };

    const handleSearchNumber = (event) => {
        setSearchNumber(event.target.value);
    };

    const clearSearchNumber = () => {
        setSearchNumber("");
    };

    const handleEditClick = (mender) => {
        const expertise = Array.isArray(mender.expertise) ? mender.expertise.join(',') : '';
        setEditMender({ ...mender, expertise });
        setIsEditing(true);
    };
    

    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setEditMender({ ...editMender, [name]: files[0] });
        } else {
            setEditMender({ ...editMender, [name]: value });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        console.log(editMender); // Add this line to debug
        try {
            const formData = new FormData();
            for (const key in editMender) {
                if (editMender[key]) {
                    formData.append(key, editMender[key]);
                }
            }
            const response = await axios.put(`${API}/api/mender/editmender/${editMender._id}`, formData); // Note: Using editMender._id instead of editMender.id
            if (response.status === 200) {
                toast.success("Mender data updated successfully");
                setIsEditing(false);
                setMenderList(prev => prev.map(m => m._id === editMender._id ? response.data : m));
            } else {
                toast.error("Error updating mender data");
            }
        } catch (error) {
            toast.error("Error updating mender data");
        }
    };

    const filterOptions = [
        { value: "all", label: "All" },
        { value: "number", label: "Mobile Number" }
    ];

    return (
        <>
            <h2 className="font-bold my-6 text-2xl ml-6">Mender Lists</h2>
            <div className="mb-4 ml-14 flex items-center flex-wrap ">
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
            <div>
                {filteredMender.length === 0 ? (
                    <div className="text-center text-gray-500">No mender data available</div>
                ) : filteredMender.map((mender, index) => (
                    <div key={index} className="relative flex space-x-10 py-6 px-10 w-[80%] justify-center items-center bg-green-700 rounded-xl ml-[10%] mb-8 mt-12 flex-wrap max-[1000px]:space-x-0 max-[1000px]:gap-7 max-[955px]:w-[90%] max-[955px]:ml-[5%] max-[800px]:flex-col max-[800px]:gap-7 max-[800px]:justify-center max-[800px]:items-center max-[590px]:w-[95%] max-[590px]:ml-[2%]">
                        <div className="relative border-4 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                            <img
                                className="h-40 w-40 object-cover object-center"
                                src={mender.profilePicture ? `${assests}/${mender.profilePicture}` : "https://dummyimage.com/400x400"}
                                alt="Profile"
                            />
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold text-white title-font mb-2">{mender.name}</h2>
                            <p className="text-white mb-2">Mobile: {mender.mobileNumber}</p>
                            <p className="text-white mb-2">Email: {mender.emailId}</p>
                            <p className="text-white mb-2">Address: {mender.currentAddress}</p>
                            <p className="text-white mb-2">Expertise: {Array.isArray(mender.expertise) ? mender.expertise.join(', ') : ''}</p>

                            <p className="text-white mb-2">Experience: {mender.experience}</p>
                        </div>
                        <div className="right-8 absolute bottom-6">
                            <button onClick={() => handleEditClick(mender)} className="w-24 px-3 py-1 font-semibold bg-blue-500 ring-white text-white rounded hover:text-blue-500 hover:bg-white hover:ring-blue-500 transition-all ease-in-out duration-300">Edit</button>
                            <button className="ml-4 w-24 px-3 py-1 font-semibold bg-red-500 ring-white text-white rounded hover:text-red-500 hover:bg-white hover:ring-red-500 transition-all ease-in-out duration-300">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg h-[500px] overflow-y-scroll">
                        <h2 className="text-2xl font-semibold mb-4">Edit Mender</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editMender.name}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    value={editMender.mobileNumber}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Email ID</label>
                                <input
                                    type="email"
                                    name="emailId"
                                    value={editMender.emailId}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Current Address</label>
                                <input
                                    type="text"
                                    name="currentAddress"
                                    value={editMender.currentAddress}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Expertise</label>
                                <input
                                    type="text"
                                    name="expertise"
                                    value={editMender.expertise}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Experience</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={editMender.experience}
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Profile Picture</label>
                                <input
                                    type="file"
                                    name="profilePicture"
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Aadhaar</label>
                                <input
                                    type="file"
                                    name="aadhaar"
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">PAN Card</label>
                                <input
                                    type="file"
                                    name="pancard"
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Bank Passbook</label>
                                <input
                                    type="file"
                                    name="bank"
                                    onChange={handleEditChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded mr-2">Save</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="p-2 bg-gray-500 text-white rounded">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default MenderList;
