import { Link, useParams } from 'react-router-dom';
import { chatRooms } from './ChatRoomData.js';

import './ChatRoom.css';
import ChatRoomBox from './ChatRoomBox'
import ChatRoomButton from './ChatRoomButtons'
import { useState ,useEffect} from "react";
import AdminChatRoomDashboard from './AdminChatRoomDashboard';
import { IsAuthOk } from '../../utils/utils';
function ChatRoom() {
    const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
    const [user42,SetUser42] = useState<any>([])
    const [userAdmin,SetUserAdmin] = useState(false);
    const [testRoom,setRoom] = useState<any>([]);
    const [allgood,setAllgood] = useState(false);
    const [isDm,setIsDm] = useState(false);
    const room = chatRooms.find((x) => x.id === params.id);
    
    if (!room) {
        // TODO: 404
    }

async function GetRoomById  ()  {


  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/GetRoomById/" + params.id;
    console.log("Api Fetch Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      json.id = params.id;
      console.log("The response Of ChatRoom is  => " + JSON.stringify(json))
      setRoom(json);
      if(json.is_dm == true)
      {
        testRoom.is_dm = true;
        console.log("This is a DM Room");
      
        setAllgood(true)
        setIsDm(true);
      }
      if(json.statusCode == "500" || IsAuthOk(json.statusCode) == 1)
        {
            console.log("an error occured");
            setErrorMessage("an error occured");
            setAllgood(false)
            window.location.reload();
        }

        else
        {
          setAllgood(true);
          console.log("Setting the chatRoom Infos ...");
          return json;
        }
     

  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

    }

  

}
useEffect (() =>
      {
        const loggeduser = localStorage.getItem("user");
          if(loggeduser)
          {
            const current = JSON.parse(loggeduser);
            GetRoomById();
            // HEre ADD contdition if user owner
            SetUserAdmin(true);
          }
      },[])
    return (
        <div className='ChatRoomMessageBox'>
        {errorMessage && <div className="error"> {errorMessage} </div>}

            {allgood ? (
              <>
              <div className='ChatRoomMessageBox'>
               <h2>{testRoom.name}</h2>
        {errorMessage && <div className="error"> {errorMessage} </div>}
            <h2><ChatRoomBox room={testRoom}
            /></h2>

            {isDm ? (
              <>

              </>
            ) : (
              <> 
                <ChatRoomButton/>
{userAdmin ? (
    <div>
      <AdminChatRoomDashboard room={room}/>
        </div>
) : (
    <div>
    
        </div>
)}
              </>
              )}
             
            <div>
                <li><Link to="/Landing">⬅️ Back to all rooms</Link> </li>
            </div>
            <div className="messages-container">
                                {/* TODO */}
            </div>
            </div>
              </> ) : (
                <>
                  
                </>
              )}
           
            </div>
    );
}

export { ChatRoom };