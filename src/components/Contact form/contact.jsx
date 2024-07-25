import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";

function Contact({ API }) {
    const [contact, setContact] = useState([]);
    const [filteredContact, setFilteredContact] = useState([]);
    const [filterOption, setFilterOption] = useState([]);
    const [searchNumber, setSearchNumber] = useState("");
   
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API}/api/contact/listform`);
                if (response.status === 200) {

                    const sortedContact = response.data.data.sort((a,b)=> new Date(b.date) - new Date(a.date));
                    setContact(sortedContact);
                    // filterContact(sortedContact,filterOption,searchNumber);
                    console.log(sortedContact)
                } else {
                    toast.error("Error during fetching contacted message");
                }
            } catch (error) {
                toast.error("Error during fetching contacted message");
            }
        };
        console.log("gg")
        fetchData();
    }, [API]);

    useEffect(()=>{
        filterContact(contact,filterOption,searchNumber);
        console.log("filter")
    },[filterOption,searchNumber,contact])

    const filterContact = (allContact,option, number) =>{
        let filtered = allContact
        if(option === "all"){

        }
        else if(option === "number" && number){
            filtered = filtered.filter(contacted => String(contacted.mobileNumber).includes(String(number)));
        }
        setFilteredContact(filtered)
    }

    const renderFile = (fileUrl) => {

    //     const filetype = fileUrl.split('.').pop().toLowerCase();
    //     const fullFilePath = `${API}/images/contactform/${fileUrl}`;
    //     return (
    //         <div className="file-preview" style={{ width: '300px', height:'400px'}}>
    //             <FileViewer
    //                 fileType={filetype}
    //                 filePath={fullFilePath}
    //                 errorComponent={() => <p>File type not supported for preview</p>}
    //                 onError={(e) => console.error(e)}
    //                 widt
    //             />
    //         </div>
    //     )
        const fileExtension = fileUrl.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
            return <Link to={`${API}/images/contactform/${fileUrl}`} target="_blank" rel="noopener noreferrer"><img src={`${API}/images/contactform/${fileUrl}`} alt="Contacted File" className="w-32" /></Link>;
        } else if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
            return (
                <Link to={`${API}/images/contactform/${fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-900">{fileUrl}</Link>
            );
        }  else {
            return <p>File type not supported for preview</p>;
        }
    };

    const handleFilterContact = (option) =>{
        setFilterOption(option)
    }

    const handleSearchNumber = (event) =>{
        setSearchNumber(event.target.value)
    }

    const clearSearchNumber = () =>{
        setSearchNumber("");
       
    }

    const filterOptions= [
        {value:"all", label:"All"},
        {value:"number",label:"Mobile Number"}
    ]

    
    return (
        <>
        <h2 className="font-bold my-6 text-2xl ml-6">Contacted Page</h2>
        <div className="mb-4 ml-14 flex items-center flex-wrap ">
            <Select
            options={filterOptions}
            defaultValue={filterOptions[0]}
            onChange={(option)=>handleFilterContact(option.value)}
            className="w-32 mr-4 mb-4"
            />
            {
                filterOption === "number" &&(
                    <div>
                        <input
                        type="number"
                        value={searchNumber}
                        onChange={handleSearchNumber}
                        placeholder="Enter Mobile Number"
                        className="border p-2 rounded mb-4"
                        />
                        <button onClick={clearSearchNumber} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2 mt-0" >X</button>
                    </div>
                )
            }
        </div>
            <div>
                {filteredContact.length === 0?(
          <div className="text-center text-gray-500">No contacted messages available</div>
        ):
            filteredContact.map((message, index) => (
                <div key={index} className="flex py-6 px-10 w-[80%] justify-center items-center bg-orange-300 rounded-xl ml-[10%] mb-8 mt-12 flex-wrap max-[1060px]:flex-col max-[1060px]:gap-7 max-[1060px]:justify-center max-[1060px]:items-center max-[590px]:w-[95%] max-[590px]:ml-[2%]">
                    <div className="flex flex-col w-[40%] justify-center  max-[1060px]:w-[90%]">
                        <p className="font-semibold">Name: {message.name}</p>
                        <p className="font-semibold">Mobile Number: {message.mobileNumber}</p>
                        <p className="font-semibold">Email: {message.emailId}</p>
                    </div>
                    <div className="flex flex-col w-[40%] justify-center items-center  max-[1060px]:w-[90%]">
                        <p className="font-semibold">Message: <span className="font-bold">{message.message}</span></p>
                        <div className="flex flex-wrap justify-center text-center">
                            {message.contactFile === null ?<p className="mt-2 text-red-600 font-semibold">No files uploaded</p>: (
                                <div className="m-2">
                                    {renderFile(message.contactFile)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))
        }
            </div>
        </>
    );
}

export default Contact;
