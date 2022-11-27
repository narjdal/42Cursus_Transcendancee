import React from "react";
import {Link} from'react-router-dom';
import { useState ,useEffect} from "react";
import DmWindow from "../DirectMsg/DmWindow"
import './Contact.css'

const Contact = (props) => {
	const [OpenMsg, SetOpenMsg] = useState(false);
    const [OpenBox,setOpenBox] = useState(true);
    // console.log(props.name);
    const [Dmcount,SetDmCount] = useState(-1);
const handleClick = (e) => {
e.preventDefault();

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

    
   // if(!OpenMsg)
    // SetDmCount(Dmcount - 1);
        // if(Dmcount === "1" )
    // {
    //     console.log("Inside Dm Count")
    //     SetDmCount("0");
    
    // }
    // else if ( Dmcount === "0")
    // {
    //     // localStorage.setItem("DmCount","1");
    // SetDmCount("1");
    // }
    // if(Dmcount == "0")
    // SetDmCount("1");
    
}
useEffect (() => {

    // SetDmCount(Dmcount  + 1);
//     if(OpenMsg)
//     {
//     console.log("Dm Window opened !" + Dmcount);
//     if(Dmcount < 2)
//    { SetDmCount(Dmcount + 1);
//     localStorage.setItem("DmCount",Dmcount.toString());
//     }
//     else 
//     {
//     SetDmCount(0);
//     console.log("Inside UseEffect Dm Count  => " ,+ Dmcount)
//     console.log("Inside UseEffect OpenMsg  => " ,+ OpenMsg)
//     localStorage.setItem("DmCount",Dmcount.toString());
//     }
    console.log("Dm Window opened !" + Dmcount);

localStorage.setItem("Dmcount",(Dmcount).toString());
// }
},[Dmcount
])
// console.log("OPENBOX =>>>>>> " + OpenBox);
const RedirFriendProfile = (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:3000/users/" + props.user.nickname;
    // window.location./// <reference path="" />
    // ("http://localhost:3000/")

}
return (
<div className="Contact-HELP"> 
    <table className="Contact-table">
        <tbody>
    <tr>
       <th></th>
       <th></th>
       <th>Name</th>
       <th>Status </th>
   </tr>
   <tr>
   <td> <img src={props.user.avatar} 
   height="20"
   className="avatar1"
   onClick={handleClick} /></td>
    {/* {OpenMsg ? (
                    <td> 
                            
                     <DmWindow contact={props.user}/> 
                     </td>
              ) : (
                <td></td>
              )} */}
   <td> 
  
   <p> <button onClick={RedirFriendProfile}>{props.user.nickname}</button> </p>
    </td> 
  {props.user.isActive ? (
                 <td>  
                    <div className="icon-div">

                         <button type="button" className='has-border' >  
                 <span className="icon material-symbols-outlined">
                {"check_circle"}        </span> 
                 </button>
                 </div>
                 
                    </td>
              ) : (
              <td> 
                    <div className="icon-off-div">
                 <button type="button" className='has-border' >  
              <span className="icon material-symbols-outlined">
             {"cancel"}        </span> 
              </button>
              </div>
                 </td>
              )}

</tr>
        </tbody>
    </table>
  
    </div>
);
};

export default Contact;


