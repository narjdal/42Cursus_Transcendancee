import { Link, useParams } from 'react-router-dom';

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
    const [haspswd,setHaspsswd] = useState(false)


async function GetRoomById  ()  {


  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/GetRoomById/" + params.id;
    console.log("Api GetRoomById Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      json.id = params.id;
      console.log("The response Of GetRoomById is  => " + JSON.stringify(json))
      setRoom(json);
      if(json.is_dm == true)
      {
        // testRoom.is_dm = true;
        console.log("This is a DM Room");
            // GetPermissions();
        setAllgood(true)
        // localStorage.setItem("isdm","true");
        setIsDm(true);
      }
      else
      {
        // localStorage.setItem("isdm","false");
        GetPermissions();
        setIsDm(false);
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
async function GetPermissions()
{


  const text = "http://localhost:5000/player/Permission/" + params.id;
    console.log("Api Get Permission  Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      json.id = params.id;
      console.log("The response Of Permissions  is  => " + JSON.stringify(json))
      // SetUserAdmin(json);
      if(json.statusMember  == "owner")
      {
        console.log("This is the owner of the room");
        SetUserAdmin(true);
      }
      if(json.statusCode == "500" || IsAuthOk(json.statusCode) == 1)
        {
            console.log("an error occured");
            setErrorMessage("an error occured");
            // setAllgood(false)
            // window.location.reload();
        }
        // else
        // {
        //   setAllgood(true);
        //   console.log("Setting the chatRoom Infos ...");
        //   return json;
        // }
     
  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

}
async function Waiit () {
  await GetRoomById();
  // if(!isDm)
  // await GetPermissions();

}
useEffect(() => {
  // if(!isDm)
  // {
  //   GetPermissions();
  // }

},[])
useEffect (() =>
      {
        const loggeduser = localStorage.getItem("user");
          if(loggeduser)
          {
            const current = JSON.parse(loggeduser);
            Waiit();
          //  setHaspsswd(true);
            // GetRoomById();
            // HEre ADD contdition if user owner
            // if(testRoom.is_dm == false)
            // if(isDm)
          //   if(!isDm)
          //   {
          //     console.log("THIS IS NOT A DDDDDDDMMMMMM")
          //   // GetPermissions();
          // }
          //   else if(isDm)
          //   {
          //     console.log("THIS IS A DM ")
          //   }
       
          }
      },[])
    return (
        <div className='ChatRoomMessageBox'>
        {errorMessage && <div className="error"> {errorMessage} </div>}
      {haspswd ? (
        <>
  HAS PASSWORD
        </>
      ) :(
        <>
      
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
      <AdminChatRoomDashboard room={testRoom}/>
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
        </>
      )}
            
           
            </div>
    );
}

export { ChatRoom };