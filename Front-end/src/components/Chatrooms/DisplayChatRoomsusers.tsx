import react from 'react'
import { useState } from 'react'; 
import { Link } from 'react-router-dom';
import './DisplayChatRoomsusers.css'
// import blobz from 'blobz.css'
const DisplayChatRoomusers = (props,roomownnership) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [action,setAction] = useState(false);
    const [isAdmin,setIsAdmin] = useState(JSON.stringify(roomownnership));
//   console.log("isADmin" + JSON.stringify(isAdmin))
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
// console.log(" DIsplay ChatRoom Users >>> " + props.user.id)
    return (
        <>
<div className="ChatRoom-HELP"> 
    <table className="ChatRoom-table">
        <tbody>
    <tr>
   </tr>
   <tr>
   <td> <img src={props.user.avatar!} 
   height="20" 
   className='avatarsidebar'/>
   </td>
   <td>
   <Link style={{color:'white'}} to={`/users/${props.user.nickname}`} >
   <p> {props.user.nickname} </p>
    </Link>
     </td> 
  <td>
{isAdmin === "true"  ? (
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
      <button type="button" id="ss" className='ButtonSocial-block' onClick={HandleBlock}>
    <span className="icon material-symbols-outlined">
     {"block"}  
      </span>

      </button> 
      <p> {errorMessage && <div className="error"> {errorMessage} </div>}  </p>

   
</>
) : (
    <>
    </>
)}
</>
) : (
<>

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