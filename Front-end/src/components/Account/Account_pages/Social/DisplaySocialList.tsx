import react from 'react'
import { useState } from 'react';
import DmWindow from '../../../DirectMsg/DmWindow';

import './DisplaySocialList.css'

const DisplaySocial = (props) => {

	const [OpenMsg, SetOpenMsg] = useState(false);
    const [Dmcount,SetDmCount] = useState(-1);

    const handleFriendClick  = (e) => {

    };
    const HandleBlock = (e) => {

    }
    const HandleOpenMsg = (e) => {
        e.preventDefault();
        SetOpenMsg(!OpenMsg)
       
if(!OpenMsg)
{
    // let tt = Dmcount + 1;
    let tt = parseInt(localStorage.getItem("Dmcount")!);
    // const tt = Dmcount + 1;
    
     tt = tt + 1;
    console.log(" TRUE " + tt);
    SetDmCount(tt);
    // let tt = parseInt(localStorage.getItem("Dmcount")!);
    // console.log("Parsed => "  + tt);
    // tt = tt - 1;
    // console.log(" => "  + tt);

    localStorage.setItem("Dmcount",(tt).toString());
    // var = var  - 1;
    // localStorage.setItem("Dmcount",var.toString());
}

if(OpenMsg)
{
       const tt = Dmcount - 1
    // tt = tt - 1;
    SetDmCount(tt);
    console.log(" FALSE "   + tt);
    // localStorage.setItem("Dmcount",(tt).toString());
}

    SetOpenMsg(!OpenMsg);

    }
    return (
        <>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

        <ul className='SocialList'>
            <li>
        <ul>  </ul>
        <span>{props.Friends.nickname}          </span>
         <img className="avatar" src={props.Friends.avatar} />
    {/* <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={handleFriendClick}>
    <span className="icon material-symbols-outlined">
     {"People"}  
      </span>

      </button> */}
      
      <button type="button" id="ss" className='ButtonSocial-block' onClick={HandleBlock}>
    <span className="icon material-symbols-outlined">
     {"block"}  
      </span>

      </button>


      {/* <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleOpenMsg}>
    <span className="icon material-symbols-outlined">
     {"Chat"}  
      </span> */}


      {/* </button> */}
      {/* {OpenMsg ? (
        <li>
            <DmWindow contact = {props.Friends} /> 
            </li>
      ) : (
        <li>

            </li>
      )} */}
      </li>
      <li>
        
      </li>
        </ul>
        </>
    )
}

export default DisplaySocial;