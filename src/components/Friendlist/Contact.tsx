import React from "react";
import {Link} from'react-router-dom';
import { useState } from "react";
import DmWindow from "../DirectMsg/DmWindow"
import './Contact.css'

const Contact = (props) => {
	const [OpenMsg, SetOpenMsg] = useState(false);
    const [OpenBox,setOpenBox] = useState(true);
    // console.log(props.name);
    const [Dmcount,SetDmCount] = useState("");
const handleClick = (e) => {
e.preventDefault();
    SetOpenMsg(!OpenMsg);
    if(Dmcount == "1" || !Dmcount)
    {
        SetDmCount("0");
        localStorage.setItem("DmCount","0");
    
    }
    else if ( Dmcount == "0")
    {
        localStorage.setItem("DmCount","1");
    SetDmCount("1");
    }
    // if(Dmcount == "0")
    // SetDmCount("1");
    
}
// console.log("OPENBOX =>>>>>> " + OpenBox);

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
   <td> <img src={props.user.ProfilePic} 
   height="20"
   onClick={handleClick} /></td>
    {OpenMsg ? (
                    <td> 
                             <button
                onClick={()=> SetOpenMsg(!OpenMsg)}><span>Close</span></button>
                     <DmWindow contact={props.user}/> 
                     </td>
              ) : (
                <td></td>
              )}
   <td> <Link style={{color:'white'}} to={`/users/${props.user._id}`} >{props.user.name}</Link></td> 
  {props.user.isActive ? (
                 <td> <img src={props.user.OnlineIcon} height="35"/></td>
              ) : (
              <td><img src={props.user.OfflineIcon} height="35"/> </td>
              )}

</tr>
        </tbody>
    </table>
  
    </div>
);
};

export default Contact;


