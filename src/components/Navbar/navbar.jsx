import React from "react";

import {assests} from '../../assests/assests'
import './nav.css'

function Navbar(){
    return(
        <>
        <div className="flex justify-between items-center px-2 py-2 border-b border-black  nav">
    <div className="flex flex-col ">
    <img src={assests.logo} alt="logo" className="w-48"/>
    <p className="font-bold  text-white ml-7 flex justify-center text-sm">Admin Panel</p>
    </div>
    <div className="w-[35px] p-[2px]">
    <img src={assests.profile} alt="profile" className=" rounded-[70%]" />
    
    </div>
    </div>
        </>
    )
}

export default Navbar;