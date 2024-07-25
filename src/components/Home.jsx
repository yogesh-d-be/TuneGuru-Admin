import React from "react";
import {assests} from '../assests/assests'

function Home(){
    return(
        <>
        <div className="flex justify-center items-center mt-20 m-auto lg:w-[60%] md:w-[50%] sm:w-[60%] max-[640px]:w-[50%] max-[530px]:w-[80%] max-[520px]:flex max-[520px]:flex-col">
        <img src={assests.gif} alt="gif" className="h-[300px] md:h-[250px] sm:h-[200px] min-[330px]:h-[180px]" />
        <img src={assests.tuneguru} alt="tuneguru logo " className="h-[180px] pr-8 md:h-[140px] sm:h-[90px] min-[330px]:h-[90px] min-[330px]:w-full" />
        </div>
        </>
    )
}

export default Home;