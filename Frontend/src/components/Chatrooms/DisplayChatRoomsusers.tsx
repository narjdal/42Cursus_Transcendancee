import react, { useEffect } from 'react'
import { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './DisplayChatRoomsusers.css'
import { io } from 'socket.io-client';
// import blobz from 'blobz.css'
const DisplayChatRoomusers = (props,roomownnership) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [action,setAction] = useState(false);
    const [display,setDisplay] = useState(false);
    const [inviteGame,setInviteGame] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
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
    
    const HandleInviteToGame = (e) => {
        e.preventDefault();
        console.log("invting this user to a game !");
        setInviteGame(true);

    }
    
    const HandleShowAction = (e) => {
        e.preventDefault();
        setAction(!action);
        // Here request to know which button to display 
    }
    useEffect(() => {

        if (inviteGame)
        {
            let socket = io("http://localhost:5000/game");

   socket.on("connect",() => {
    console.log("socket : ",socket);
   })

   socket.emit("inviteGame",{
    user:localStorage.getItem("user")!,
    invite:props.user.nickname
   })

   socket.on("InviteUpdate",(data:any) => {
    setErrorMessage("");
    console.log("Invite Update Data : ",data)
    if(data.logged)
    {
    localStorage.setItem("inviteGame",data.inviteeNickname)
   navigate('/Pong') 
    }
    
   })
  }
    },[inviteGame])
    
    useEffect(() => {
        const loggeduser = localStorage.getItem("user");
        if(loggeduser)
        {
            const current = JSON.parse(loggeduser);
            if (current.id == props.user.id)
            {
                setDisplay(false);
            }
            else
            setDisplay(true);
            let texttt = "HasRoomAccess" + params.id

            console.log("SETTING TEXT TO FALSE " + texttt)
          
            localStorage.setItem(texttt,"false")
        }
    })
console.log(" DIsplay ChatRoom Users >>> " + props.user + " nickname : " , props.user.nickname)
    return (
        <>
<div className="ChatRoom-HELP"> 
    <table className="ChatRoom-table">
        <tbody>
            {display ? (
                <>
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
                <button>
  <span className="icon material-symbols-outlined" onClick={HandleInviteToGame}>
     {"stadia_controller"}  
      </span>
      </button>
{/* {isAdmin === "true"  ? (
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
)} */}


      
      </td>

   </tr>
                </>
            ) : (
                <>
                </>
            )}
   
   </tbody>
   </table>
   </div>
        </>


       
    )
}
export default DisplayChatRoomusers;