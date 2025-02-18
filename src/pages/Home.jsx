import React from "react";
import {FaArrowRight} from "react-icons/fa"
import {Link} from "react-router-dom"

const Home = () =>{
    return(
        <div>
            {/*Section1 */}
                <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between">
                    <Link to={"/signup"}>
                    <div className="mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95">
                        <div>
                            <p>Become an Instructor</p>
                            <FaArrowRight/>
                        </div>
                    </div>

                    </Link>
                </div>
     
            {/*Section2 */}
     
     
            {/*Section3 */}
     
     
            {/*Section4 */}
        </div>
    )
}

export default Home