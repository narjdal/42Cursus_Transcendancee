import react from 'react'
import { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './DisplayChatRoomsusers.css'
// import blobz from 'blobz.css'
const DisplayChatRoomusers = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [action,setAction] = useState(false);
    const [isAdmin,setIsAdmin] = useState("");
    const handleFriendClick  = (e) => {
        e.preventDefault();
        //if() Request to Add Friend , if already : 
        setErrorMessage("You are alredy friend !");
        
    };
    const HandleBlock = (e) => {
        e.preventDefault();
    }
    
    const HandleShowAction = (e) => {
        e.preventDefault();
        setAction(!action);
        // Here request to know which button to display 
    }
console.log(" DIsplay ChatRoom Users >>> " + props.user.id)
    return (
        <>
<div className="ChatRoom-HELP"> 
    <table className="ChatRoom-table">
        <tbody>
    <tr>
   </tr>
   <tr>
   <td> <img src={props.user.image_url!} 
   height="20" 
   className='avatarsidebar'/>
   </td>
   <td>
     <Link style={{color:'white'}} to={`/users/${props.user.id}`} >
    <p>{props.user.name}</p>
        </Link>
     </td> 
  <td>
{isAdmin === "true"  ? (
<>

</>
) : (
<>
<button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleShowAction}>
    <span className="icon material-symbols-outlined">
     {"Settings"}  
      </span>
      </button>

{action ? (
<>
   <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={handleFriendClick}>
    <span className="icon material-symbols-outlined">
     {"people"}  
      </span>

      </button>
      <p> {errorMessage && <div className="error"> {errorMessage} </div>}  </p>

      <button type="button" id="ss" className='ButtonSocial-block' onClick={HandleBlock}>
    <span className="icon material-symbols-outlined">
     {"block"}  
      </span>

      </button> 
</>
) : (
    <>
    </>
)}

</>
)}


      
      </td>

   </tr>
   </tbody>
   </table>
   </div>
        </>


       
    )
}
export default DisplayChatRoomusers;