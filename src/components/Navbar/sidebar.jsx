import React from "react";
import { assests } from "../../assests/assests";
import { NavLink } from "react-router-dom";
import './nav.css'

function Sidebar(){
    return(
        <>
        <div className="w-[20%] min-h-[100vh] border border-gray-400 border-t-0">
            <div className="pt-12 pl-[15%] flex flex-col gap-7 justify-center">
                <NavLink to='/addservice' className="flex items-center gap-4 border border-gray-400 border-r-0 px-2 py-3 rounded-md cursor-pointer act">
                    <img src={assests.add} alt="add" className="w-8 "/>
                    <p className="text-md max-md:hidden max-lg:text-sm my-auto">Add Service</p>
                </NavLink>
                <NavLink to='/listservice' className="flex items-center gap-4 border border-gray-400 border-r-0 px-2 py-3 rounded-md cursor-pointer act" >
                    <img src={assests.list} alt="add" className="w-8"/>
                    <p className="max-md:hidden md:block max-lg:text-sm my-auto">List Service</p>
                </NavLink>
                <NavLink to='/bookings' className="flex items-center gap-4 border border-gray-400 border-r-0 px-2 py-3 rounded-md cursor-pointer act" >
                    <img src={assests.order} alt="add" className="w-8"/>
                    <p className="text-md max-md:hidden max-lg:text-sm my-auto">Bookings</p>
                </NavLink>
                <NavLink to='/contactform' className="flex items-center gap-4 border border-gray-400 border-r-0 px-2 py-3 rounded-md cursor-pointer act" >
                    <img src={assests.contact} alt="add" className="w-8"/>
                    <p className="text-md max-md:hidden max-lg:text-sm my-auto">Contacted</p>
                </NavLink>
                <NavLink to='/menderlist' className="flex items-center gap-4 border border-gray-400 border-r-0 px-2 py-3 rounded-md cursor-pointer act" >
                    <img src={assests.mender} alt="add" className="w-8"/>
                    <p className="text-md max-md:hidden max-lg:text-sm my-auto">Menders</p>
                </NavLink>
            </div>
        </div>
        </>
    )
}

export default Sidebar;