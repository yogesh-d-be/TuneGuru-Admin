import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assests } from "../../assests/assests";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Booking({ API }) {

  const [tab, setTab] = useState("bookings")

  // const [menderList, setMenderList] = useState([]);

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);

  const [filterOption, setFilterOption] = useState("all"); // fo filter bookings option
  const [completedFilterOption, setCompletedFilterOption] = useState("all"); // for completed bookings option
  const [cancelledFilterOption, setCancelledFilterOption] = useState("all"); // for completed bookings option

  const [customDate, setCustomDate] = useState(null); // for bookings custom date
  const [completedCustomDate, setCompletedCustomDate] = useState(null); // for completed bookings custom date
  const [cancelledCustomDate, setCancelledCustomDate] = useState(null); // for Cancelled bookings custom date

  const [customerName, setCustomerName] = useState(""); // for completed bookings customer name
  const [cancelledCustomerName, setCancelledCustomerName] = useState(""); // for completed bookings customer name


  // const fetchMenderData = useCallback(async () => {
  //   try {
  //     const response = await axios.get(`${API}/api/mender/listmender`);
  //     if (response.status === 200) {
  //       setMenderList(response.data.data);
  //       console.log(response.data.data)
  //     } else {
  //       toast.error("Error during fetching mender data");
  //     }
  //   } catch (error) {
  //     toast.error("Error during fetching mender data");
  //   }
  // }, [API]);

  // useEffect(() => {
  //   fetchMenderData();
  //   const interval = setInterval(fetchMenderData, 60000);
  //   return () => clearInterval(interval);
  // }, [fetchMenderData]);
  

  const statusHandler = async (event, bookingId) => {
    try {
      const response = await axios.post(API + "/api/book/status", {
        bookingId,
        status: event.value,
      });
      if (response.data.success) {
        updateBookingStatus(bookingId, event.value);
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };




  const updateBookingStatus = (bookingId, status) => {
    const updatedBookings = bookings.map((booking) =>
      booking._id === bookingId ? { ...booking, status } : booking
    );
    window.location.reload()
    console.log("update")
    setBookings(updatedBookings);
    filterBookings(updatedBookings, filterOption, customDate);
    filterCompletedBookings(updatedBookings, completedFilterOption, completedCustomDate, customerName);
    filterCancelledBookings(updatedBookings, cancelledFilterOption, cancelledCustomDate,cancelledCustomerName);

    
  };
  

  

  const filterBookings = useCallback((allBookings, option, date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayDate = formatDate(today);
    const tomorrowDate = formatDate(tomorrow);

    let filtered = allBookings.filter((booking) => booking.status === "TuneGuru Mender Searching" || booking.status === "TuneGuru Mender Assigned"  );


    if (option === "all") {
      // Filter all bookings
    } else if (option === "today") {
      filtered = filtered.filter((booking) => booking.bookingDate === todayDate);
    } else if (option === "tomorrow") {
      filtered = filtered.filter((booking) => booking.bookingDate === tomorrowDate);
    } else if (option === "custom" && date) {
      const selectedDate = formatDate(date);
      filtered = filtered.filter((booking) => booking.bookingDate === selectedDate);
    }

    setFilteredBookings(filtered);
  },[]);




  const filterCompletedBookings = useCallback((allBookings, option, date, name) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayDate = formatDate(today);
    const tomorrowDate = formatDate(tomorrow);

    let completed = allBookings.filter((booking) => booking.status === "TuneGuru Mender On Way");

    if (option === "all") {
      // Filter all completed bookings
    } else if (option === "today") {
      completed = completed.filter((booking) => booking.bookingDate === todayDate);
    } else if (option === "tomorrow") {
      completed = completed.filter((booking) => booking.bookingDate === tomorrowDate);
    } else if (option === "custom" && date) {
      const selectedDate = formatDate(date);
      completed = completed.filter((booking) => booking.bookingDate === selectedDate);
    } else if (option === "customerName" && name) {
      completed = completed.filter((booking) =>
        booking.address.firstName.toLowerCase().includes(name.toLowerCase())
      );
    }

    setCompletedBookings(completed);
  },[]);

  const filterCancelledBookings = useCallback((allBookings, option, date, name) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayDate = formatDate(today);
    const tomorrowDate = formatDate(tomorrow);

    let cancelled = allBookings.filter((booking) => booking.status === "Cancel");

    if (option === "all") {
      // Filter all cancelled bookings
    } else if (option === "today") {
      cancelled = cancelled.filter((booking) => booking.bookingDate === todayDate);
    } else if (option === "tomorrow") {
      cancelled = cancelled.filter((booking) => booking.bookingDate === tomorrowDate);
    } else if (option === "custom" && date) {
      const selectedDate = formatDate(date);
      cancelled = cancelled.filter((booking) => booking.bookingDate === selectedDate);
    } else if (option === "customerName" && name) {
      cancelled = cancelled.filter((booking) =>
        booking.address.firstName.toLowerCase().includes(name.toLowerCase())
      );
    }

    setCancelledBookings(cancelled); // Update cancelled bookings state
  },[]);


  const fetchAllBookings = useCallback( async () => {
    try {
      const response = await axios.get(API + "/api/book/listbookings");
      if (response.data.success) {
        // Sort bookings by the 'date' field in descending order
        const sortedBookings = response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setBookings(sortedBookings);
        filterBookings(sortedBookings, filterOption, customDate);
        filterCompletedBookings(sortedBookings, completedFilterOption, completedCustomDate, customerName);
        filterCancelledBookings(sortedBookings,cancelledFilterOption,cancelledCustomDate,cancelledCustomerName)
      } else {
        toast.error("Error fetching bookings");
      }
    } catch (error) {
      toast.error("Error fetching bookings");
    }
  },[API, cancelledCustomDate, cancelledCustomerName, cancelledFilterOption, completedCustomDate, completedFilterOption, customDate, customerName,filterBookings, filterOption, filterCancelledBookings, filterCompletedBookings]);
  
 
  useEffect(() => {
    fetchAllBookings();
    const interval = setInterval(fetchAllBookings, 60000); // Fetch bookings every 60 seconds
    console.log("f")
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [fetchAllBookings]);
 
  useEffect(() => {
    filterBookings(bookings, filterOption, customDate);
    
    console.log("bookings")
  }, [filterOption, customDate, bookings, filterBookings]);


  useEffect(() => {
    filterCompletedBookings(bookings, completedFilterOption, completedCustomDate, customerName);
    console.log("complete bookings")
  }, [completedFilterOption, completedCustomDate, customerName, bookings, filterCompletedBookings]);

  useEffect(() => {
    filterCancelledBookings(bookings, cancelledFilterOption, cancelledCustomDate, cancelledCustomerName);
    console.log("cancelled bookings")
  }, [cancelledFilterOption, cancelledCustomDate, cancelledCustomerName, bookings, filterCancelledBookings]);

  const handleFilterChange = (option) => {
    setFilterOption(option);
  };

  const handleCompletedFilterChange = (option) => {
    setCompletedFilterOption(option);
  };

  const handleCancelledFilterChange = (option) => {
    setCancelledFilterOption(option);
  };


  const handleCustomDateChange = (date) => {
    setCustomDate(date);
  };

  const handleCompletedCustomDateChange = (date) => {
    setCompletedCustomDate(date);
  };
  const handleCancelledCustomDateChange = (date) => {
    setCancelledCustomDate(date);
  };


  const handleCustomerNameChange = (event) => {
    setCustomerName(event.target.value);
  };
  const handleCancelledCustomerNameChange = (event) => {
    setCancelledCustomerName(event.target.value);
  };
  

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  };

  const clearCustomDate = () => {
    setCustomDate(null);
  };

  
  const clearCompletedCustomDate = () => {
    setCompletedCustomDate(null);
  };
  
  const clearCancelledCustomDate = () => {
    setCancelledCustomDate(null);
  };

  const clearCustomerName = () => {
    setCustomerName("");
  };

  const clearCancelledCustomerName = () => {
    setCancelledCustomerName("");
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "custom", label: "Custom" },
  ];

  const completedFilterOptions = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "custom", label: "Custom" },
    { value: "customerName", label: "Customer Name" },
  ];

  const cancelledFilterOptions = [
    { value: "all", label: "All" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "custom", label: "Custom" },
    { value: "customerName", label: "Customer Name" },
  ];

  const statusOptions = [
    { value: "TuneGuru Mender Searching", label: "TuneGuru Mender Searching", color: "brown" },
    { value: "TuneGuru Mender Assigned", label: "TuneGuru Mender Assigned", color: "blue" },
    { value: "TuneGuru Mender On Way", label: "TuneGuru Mender On Way", color: "green" },
    { value: "Cancel", label: "Cancel", color: "red" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      fontWeight: "600",
      color: state.data.color,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      fontWeight: "600",
      color: state.data.color,
    }),
  };
  return (
    <div>
      <h2 className="font-bold my-6 text-2xl ml-6">Booking Page</h2>
      <div className="flex flex-wrap mb-4 ml-6 mr-2 justify-center">
      <button onClick={()=>{setTab("bookings")}}  className={`px-4 py-3 mr-4 mb-3  rounded w-[210px]  font-bold ${tab === "bookings"? "bg-blue-900 text-white ring-2 ring-blue-900" :" text-blue-900 bg-white ring-2 ring-blue-900"}`}>Bookings</button>
      <button onClick={()=>{setTab("completedbookings")}} className={`mb-3 px-4 py-3 mr-4  rounded w-[210px]  font-bold ${tab === "completedbookings"? "bg-blue-900 text-white ring-blue-900 ring-2" :" text-blue-900 bg-white ring-2 ring-blue-900"}`}>Completed Bookings</button>
      <button onClick={()=>{setTab("cancelledbookings")}} className={`mb-3 px-4 py-3 mr-4  rounded w-[210px]  font-bold ${tab === "cancelledbookings"? "bg-blue-900 text-white ring-blue-900 ring-2" :" text-blue-900 bg-white ring-2 ring-blue-900"}`}>cancelled Bookings</button>
      </div>
      <div>{tab === "bookings" &&(
        <>
      <div className="mb-4 ml-14 flex items-center flex-wrap ">
        <Select
        options = {filterOptions}
        defaultValue={filterOptions[0]}
        onChange={(option)=> handleFilterChange(option.value)} // in filter option value ="all","today"...so option.value pass to handleFilterChange as option
        className="w-32 mr-4 mb-4"
        />
        {filterOption === "custom"&& (
          <div>
          <DatePicker
          selected={customDate}
          onChange={handleCustomDateChange}
          dateFormat="dd/MM/yy"
          className="border p-2 rounded w-28 mb-4 "
          placeholderText="Select Date"
          />
          <button onClick={clearCustomDate} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2">X</button>
          </div>
        )
        }
       
      </div>
        {filteredBookings.length === 0 ?(
          <div className="text-center text-gray-500">No bookings available</div>
        ):
        (filteredBookings.map((book, index) => (
          <div key={index} className="flex flex-col justify-center items-center md:flex-row">
            <img src={assests.book} alt="booked" className="w-12 h-16 mt-6" />
            <div className="flex flex-col flex-wrap border border-gray-300 p-2 rounded-lg w-[95%] mt-4 md:flex-row justify-center items-center">
              <div className="flex flex-wrap flex-col md:w-[40%] w-full h-[40%]">
                <div className="px-2 py-1 rounded-lg mt-3">
                  {book.bookings.map((booked, i) => (
                    <div key={i} className="bg-red-200 rounded-lg mb-2 px-3 py-1 w-[230px]">
                      {booked.serviceName + " - " + booked.quantity}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col flex-wrap mt-3 bg-green-200 px-2 py-2 rounded-xl h-[60%]">
                  <p>{book.address.firstName + " " + book.address.lastName}</p>
                  <p>{book.address.street + ", "}</p>
                  <p>{book.address.city + " - " + book.address.pincode + ", " + book.address.state}</p>
                  <p>{book.address.mobileNumber}</p>
                </div>
                <div className="flex flex-col flex-wrap mt-3 bg-orange-200 px-2 py-2 rounded-xl h-[10%]">
                  <p>Booking Date: {book.bookingDate}</p>
                  <p>Booking Time: {book.bookingTime}</p>
                </div>
              </div>
              <div className="flex flex-col md:w-[60%] flex-wrap w-full">
                <div className="flex flex-col flex-wrap justify-center gap-6 items-center mb-4">
                  <p>Booked Services: {book.bookings.length}</p>
                  <p>&#x20B9; {book.amount}</p>
                  <p>Payment Method: <span className="font-bold text-orange-600">{book.paymentMethod}</span></p>
                </div>
                <div className="flex flex-col flex-wrap justify-center gap-6 items-center max-[990px]:flex max-[990px]:flex-row">
                  <Select
                    options={statusOptions}
                    defaultValue={statusOptions.find((option) => option.value === book.status)}
                    onChange={(event) => statusHandler(event, book._id)}
                    styles={customStyles}

                    
                  />
                </div>
                <div className="flex flex-col justify-center text-center items-center">
                  {book.repairVideo && (
                    <div className="mt-4 w-[300px] max-[800px]:w-[240px] max-[620px]:w-[200px]">
                      <video controls width="full" className=" rounded-lg">
                      <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/mp4" />
    <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/webm" />
    <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/ogv`} "/>
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
        )}
        </>
      )}
      </div>
{/* 
      completed bookings */}
       {tab === "completedbookings" &&(
        <>
      <div className="">
      
      <div className="mb-4 ml-14 flex items-center flex-wrap">
        <Select
        options = {completedFilterOptions}
        defaultValue={completedFilterOptions[0]}
        onChange={(option)=> handleCompletedFilterChange(option.value)} // in filter option value ="all","today"...so option.value pass to handleFilterChange as option
        className="w-32 mr-4 mb-4"
        />
        {completedFilterOption === "custom"&& (
          <div>
          <DatePicker
          selected={completedCustomDate}
          onChange={handleCompletedCustomDateChange}
          dateFormat="dd/MM/yy"
          className="border p-2 rounded w-28 mb-4"
          placeholderText="Select Date"
          />
          <button onClick={clearCompletedCustomDate} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2" >X</button>
          </div>
        )
        }
         {completedFilterOption === "customerName" && (
             <div>
             <input
               type="text"
               value={customerName}
               onChange={handleCustomerNameChange}
               placeholder="Enter customer name"
               className="border p-2 rounded mb-4"
             />
             <button onClick={clearCustomerName} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2 mt-0" >X</button>
           </div>
          )}
       
      </div>

      <div>
        {completedBookings.length === 0 ?(
          <div className="text-center text-gray-500">No bookings available</div>
        ):
        (completedBookings.map((book, index) => (
          <div key={index} className="flex flex-col justify-center items-center md:flex-row">
            <img src={assests.book} alt="booked" className="w-12 h-16 mt-6" />
            <div className="flex flex-col flex-wrap border border-gray-300 p-2 rounded-lg w-[95%] mt-4 md:flex-row justify-center items-center">
              <div className="flex flex-wrap flex-col md:w-[40%] w-full h-[40%]">
                <div className="px-2 py-1 rounded-lg mt-3">
                  {book.bookings.map((booked, i) => (
                    <div key={i} className="bg-red-200 rounded-lg mb-2 px-3 py-1 w-[230px]">
                      {booked.serviceName + " - " + booked.quantity}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col flex-wrap mt-3 bg-green-200 px-2 py-2 rounded-xl h-[60%]">
                  <p>{book.address.firstName + " " + book.address.lastName}</p>
                  <p>{book.address.street + ", "}</p>
                  <p>{book.address.city + " - " + book.address.pincode + ", " + book.address.state}</p>
                  <p>{book.address.mobileNumber}</p>
                </div>
                <div className="flex flex-col flex-wrap mt-3 bg-orange-200 px-2 py-2 rounded-xl h-[10%]">
                  <p>Booking Date: {book.bookingDate}</p>
                  <p>Booking Time: {book.bookingTime}</p>
                </div>
              </div>
              <div className="flex flex-col md:w-[60%] flex-wrap w-full">
                <div className="flex flex-col flex-wrap justify-center gap-6 items-center mb-4">
                  <p>Booked Services: {book.bookings.length}</p>
                  <p>&#x20B9; {book.amount}</p>
                </div>
                <div className="flex flex-col flex-wrap justify-center gap-6 items-center max-[990px]:flex max-[990px]:flex-row">
                  <Select
                    options={statusOptions}
                    defaultValue={statusOptions.find((option) => option.value === book.status)}
                    onChange={(event) => statusHandler(event, book._id)}
                    styles={customStyles}
                    
                  />
                </div>
                <div className="flex flex-col justify-center text-center items-center">
                  {book.repairVideo && (
                    <div className="mt-4 w-[300px] max-[800px]:w-[240px] max-[620px]:w-[200px]">
                      <video controls width="full" className=" rounded-lg">
                        <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/mp4" />
                        <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/webm" />
                        <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/ogv" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
        )}
        
        
      </div>
      </div>
      </>
        )}

{/* 
      cancelled bookings */}
       {tab === "cancelledbookings" &&(
        <>
      <div className="">
      
      <div className="mb-4 ml-14 flex items-center flex-wrap">
        <Select
        options = {cancelledFilterOptions}
        defaultValue={cancelledFilterOptions[0]}
        onChange={(option)=> handleCancelledFilterChange(option.value)} // in filter option value ="all","today"...so option.value pass to handleFilterChange as option
        className="w-32 mr-4 mb-4"
        />
        {cancelledFilterOption === "custom"&& (
          <div>
          <DatePicker
          selected={cancelledCustomDate}
          onChange={handleCancelledCustomDateChange}
          dateFormat="dd/MM/yy"
          className="border p-2 rounded w-28 mb-4"
          placeholderText="Select Date"
          />
          <button onClick={clearCancelledCustomDate} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2" >X</button>
          </div>
        )
        }
         {cancelledFilterOption === "customerName" && (
             <div>
             <input
               type="text"
               value={cancelledCustomerName}
               onChange={handleCancelledCustomerNameChange}
               placeholder="Enter customer name"
               className="border p-2 rounded mb-4"
             />
             <button onClick={clearCancelledCustomerName} className="p-2 bg-gray-200 font-semibold rounded-r-md mr-2 mt-0" >X</button>
           </div>
          )}
       
      </div>

      <div>
        {cancelledBookings.length === 0 ?(
          <div className="text-center text-gray-500">No cancelled bookings available</div>
        ):
        (cancelledBookings.map((book, index) => (
          <div key={index} className="flex flex-col justify-center items-center md:flex-row">
            <img src={assests.book} alt="booked" className="w-12 h-16 mt-6" />
            <div className="flex flex-col flex-wrap border border-gray-300 p-2 rounded-lg w-[95%] mt-4 md:flex-row justify-center items-center">
              <div className="flex flex-wrap flex-col md:w-[40%] w-full h-[40%]">
                <div className="px-2 py-1 rounded-lg mt-3">
                  {book.bookings.map((booked, i) => (
                    <div key={i} className="bg-red-200 rounded-lg mb-2 px-3 py-1 w-[230px]">
                      {booked.serviceName + " - " + booked.quantity}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col flex-wrap mt-3 bg-green-200 px-2 py-2 rounded-xl h-[60%]">
                  <p>{book.address.firstName + " " + book.address.lastName}</p>
                  <p>{book.address.street + ", "}</p>
                  <p>{book.address.city + " - " + book.address.pincode + ", " + book.address.state}</p>
                  <p>{book.address.mobileNumber}</p>
                </div>
                <div className="flex flex-col flex-wrap mt-3 bg-orange-200 px-2 py-2 rounded-xl h-[10%]">
                  <p>Booking Date: {book.bookingDate}</p>
                  <p>Booking Time: {book.bookingTime}</p>
                </div>
              </div>
              <div className="flex flex-col md:w-[60%] flex-wrap w-full">
                <div className="flex flex-col flex-wrap justify-center gap-6 items-center mb-4">
                  <p>Booked Services: {book.bookings.length}</p>
                  <p>&#x20B9; {book.amount}</p>
                </div>
                <div className="flex flex-col flex-wrap justify-center gap-6 items-center max-[990px]:flex max-[990px]:flex-row">
                  <Select
                    options={statusOptions}
                    defaultValue={statusOptions.find((option) => option.value === book.status)}
                    onChange={(event) => statusHandler(event, book._id)}
                    styles={customStyles}
                    
                  />
                </div>
                <div className="flex flex-col justify-center text-center items-center">
                  {book.repairVideo && (
                    <div className="mt-4 w-[300px] max-[800px]:w-[240px] max-[620px]:w-[200px]">
                      <video controls width="full" className=" rounded-lg">
                        <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/mp4" />
                        <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/webm" />
                        <source src={`${API}/video/RepairVideo/${book.repairVideo}`} type="video/ogv" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
        )}
        
        
      </div>
      </div>
      </>
        )}


    </div>
  );
}

export default Booking;
