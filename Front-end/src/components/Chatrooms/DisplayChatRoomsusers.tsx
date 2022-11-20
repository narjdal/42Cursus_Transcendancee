import react from 'react'
import { useState } from 'react'; 
import { Link } from 'react-router-dom';
// import blobz from 'blobz.css'
const DisplayChatRoomusers = (props) => {
    const handleFriendClick  = (e) => {

    };
    const HandleBlock = (e) => {

    }
    
console.log(" DIsplay ChatRoom Users >>> " + props.user.id)
    return (
        <>
<div className="Contact-HELP"> 
    <table className="Contact-table">
        <tbody>
    <tr>
   </tr>
   <tr>
   <td> <img src={props.user.image_url!} 
   height="20" 
   className='avatar1'/>
   </td>
   <td>
     <Link style={{color:'white'}} to={`/users/${props.user.id}`} >{props.user.name}</Link>
     </td> 
  <td>
   <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={handleFriendClick}>
    <span className="icon material-symbols-outlined">
     {"People"}  
      </span>

      </button>
      </td>
      <td>
      <button type="button" id="ss" className='ButtonSocial-block' onClick={HandleBlock}>
    <span className="icon material-symbols-outlined">
     {"block"}  
      </span>

      </button> 
      </td>

   </tr>
   </tbody>
   </table>
   </div>
        </>

    )
}
export default DisplayChatRoomusers;