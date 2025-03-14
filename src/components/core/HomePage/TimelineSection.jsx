import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImgae from "../../../assets/Images/TimelineImage.png"

const timeline =[
    {
        Logo:Logo1,
        heading:"Leadership",
        Description:"Fully committed to the success Company"
    },
    {
        Logo:Logo2,
        heading:"Leadership",
        Description:"Fully committed to the success Company"
    },
    {
        Logo:Logo3,
        heading:"Leadership",
        Description:"Fully committed to the success Company"
    },
    {
        Logo:Logo4,
        heading:"Leadership",
        Description:"Fully committed to the success Company"
    }
]
const TimelineSection = () => {
  return (
    <div>
    <div className='flex gap-15 items-center'>

        <div className='flex flex-col w-[45%] gap-5'>
        {
            timeline.map( (element,index) =>{
                return (
                    <div className='flex gap-6' key={index}>
                        <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                <img src={element.Logo} alt=''/>
                        </div>
                        <div>
                            <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                            <p className='text-base'>{element.Description}</p>
                        </div>
                    </div>
                )
            })
        }

        </div>

        <div className='relative shadow-blue-200'>
            <img src={timelineImgae} alt='timelineImage' className='shadow-white object-cover h-fit'/>
            <div className='absolute bg-caribbeangreen-700 flex text-white uppercase py-7 left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                <div className='flex items-center gap-3 border-r border-caribbeangreen-300 px-7'>
                    <p className='text-3xl font-bold'>10</p>
                    <p className='text-small text-caribbeangreen-300'>Years of experience</p>
                </div>
                <div className='flex items-center gap-3 border-r border-caribbeangreen-300 px-7'>
                    <p className='text-3xl font-bold'>250</p>
                    <p className='text-small text-caribbeangreen-300'>types of courses</p>
                </div>
            </div>
        </div>

    </div>

    </div>
  )
}

export default TimelineSection