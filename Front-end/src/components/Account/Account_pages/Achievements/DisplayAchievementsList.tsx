import react from 'react'
import { useState,useEffect } from 'react';
import './DisplayAchievementsList.css'
const DisplayAchievementsList = (props) => {

    const loggeduser = localStorage.getItem("user");
    if (loggeduser)
    {
        var Current_User = JSON.parse(loggeduser);
        
    }

    console.log("inside Achievements     DDD");
    return (
        <>
  
        <ul className='AchievementsList'>
        
            <div className='Achievements-container'>
            <li>
                 <img  className='avatar' src={props.AchievementsList.image_url} height="30"/> 
                 <span>{props.AchievementsList.name} </span> 
            
                 <span>{props.AchievementsList.description} </span> </li>
  {props.AchievementsList.unlock ? (
<>
<div className='unlocked-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"lock_open"}        </span> 
      </button>
      </div>
</>
  ):(
<>
<div className='locked-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"lock"}        </span> 
      </button>
      </div>
</>
  )}

             </div>
        </ul>

       
        </>
    )
}

export default DisplayAchievementsList