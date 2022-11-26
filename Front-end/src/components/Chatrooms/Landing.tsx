import { chatRooms } from './ChatRoomData.js';
import {Link} from'react-router-dom';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import {Pop} from '../../utils/Popup';

import './Landing.css'
function Landing() {
    const navigate = useNavigate();
    const [BackendRooms,setChatRooms] = useState<any>([]);
    const  [showinput,setInput] = useState(false);
    const [Roompassword,setRoomPassword] = useState("");
const [errorMessage, setErrorMessage] = useState("");
   const [isUpdating, setIsUpdating] = useState(false);
const [Updated, setisUpdated] = useState(false);
const [prevRoom,setPrevRoom] = useState("");
    const HandleClick = (e) => {
        navigate('/CreateRoom')
    };
    const HandleShowPassword = (e) => {
        e.preventDefault();
        setInput(!showinput)
    }

    const UpdateRoomPassword = (e) => {
        e.preventDefault();
        if(!Roompassword)
        {
          console.log("ERROR");
        setErrorMessage("Error ! No password inputed")    
      }
      else
      {
        
        console.log("Updating room passwond ..." +Roompassword) 
        setErrorMessage("")    
    
        setTimeout(() => {
          setIsUpdating(false);
          setisUpdated(true);
          setTimeout(() => setisUpdated(false), 2500);
          // window.location.reload();
       
        }, 2000);
      }
      }
    return (
        <>
        <div className='ChatRooms-card'>
            <h2> Join a ChatRoom </h2>
           <button className='CreateChatRoom-button' onClick={HandleClick}> Create a Chat Room </button>
            <ul className="chat-room-list">
                {chatRooms.map((room) => (
                    <li key={room.id}>
                        {room.password ? (
                         <>
        
     <Pop room={room}/> 
      {(showinput  && prevRoom !== room.id )? (
        <>
          

<button
      onClick={UpdateRoomPassword}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : ""}
      </span>
    </button>
    {errorMessage && <div className="error"> {errorMessage} </div>}
        
        </>
      ) : (
        <>

        </>
      )}
                         </>   
                        ) : (
                            <>
                    <Link to={`/room/${room.id}`}>{room.title}</Link>
                            
                            </>
                        )}
                    </li>
                ))}
            </ul>
            </div>
        </>
    );
}

export { Landing };