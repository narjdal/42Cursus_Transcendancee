import { chatRooms } from './ChatRoomData.js';
import {Link} from'react-router-dom';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Pop} from '../../utils/Popup';
import { IsAuthOk } from '../../utils/utils';
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
const [roomid,setRoomId] = useState("");

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
async function GetRoomList  ()  {


  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/listOfRooms"
    console.log("Api Fetch Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      console.log("The response is => " + JSON.stringify(json))
    if(IsAuthOk(json.statusCode) == 1)
    window.location.reload();
      setChatRooms(json);
  
      return json;
  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

    }

  

}
async function JoinRoom()
{
 
  
  const text = "http://localhost:5000/player/joinRoom/" + "1";
    console.log("THE  Join Room Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      console.log("The response is => " + JSON.stringify(json))


      return json;
  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

}
const HandleJoinRoom = (e) => {
e.preventDefault();
console.log("JOING THIS ROOM " + roomid )
JoinRoom()

}
      useEffect (() =>
      {
        const loggeduser = localStorage.getItem("user");
          if(loggeduser)
          {
            const current = JSON.parse(loggeduser);
            GetRoomList();
          }
      },[])
    return (
        <>
        <div className='ChatRooms-card'>
            <h2> Join a ChatRoom </h2>
           <button className='CreateChatRoom-button' onClick={HandleClick}> Create a Chat Room </button>
            <ul className="chat-room-list">
                {BackendRooms.map((room) => (
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
                    <button 
                    onClick={HandleJoinRoom}
                    onChange={event => setRoomId(room.id)}>
                      <Link to={`/room/${room.id}`}>{room.name}</Link>
                      </button>
                            
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