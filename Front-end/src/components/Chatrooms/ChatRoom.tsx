import { Link, useParams } from 'react-router-dom';

import './ChatRoom.css';
import ChatRoomBox from './ChatRoomBox'
import ChatRoomButton from './ChatRoomButtons'
import { useState ,useEffect} from "react";
import AdminChatRoomDashboard from './AdminChatRoomDashboard';
import { IsAuthOk } from '../../utils/utils';
import { Pop } from '../../utils/Popup';
import axios from 'axios';

function ChatRoom() {
    const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
    const [user42,SetUser42] = useState<any>([])
    const [roomPerm,setRoomPerm] = useState<any>([])
    
    const [userAdmin,SetUserAdmin] = useState(false);
    const [testRoom,setRoom] = useState<any>([]);
    const [allgood,setAllgood] = useState(false);
    const [isDm,setIsDm] = useState(false);
    const [statusMember,setStatusMember] = useState("");
    const [haspswd,setHaspsswd] = useState(false)

    const [HasPermission,setHasPermissions] = useState(false);



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
      console.log("An error occured  while fetching the friendship status .: " + error)
      return error;
  })

    }

  

}
async function GetPermissions()
{


  const text = "http://localhost:5000/player/Permission/" + params.id;
    console.log("Api Get Permission  Link :  =>  " + text);
    

    await axios.get(text,{
      withCredentials:true
      // mode:'no-cors',
      // method:'get',
      // credentials:"include"
  })
  
  // .then((response) => response.json())
  .then(json => {
      // json.data.id = params.id;
      // console.log("json" + json)
      console.log("The response Of Permissions  is  => " + JSON.stringify(json.data))
      // SetUserAdmin(json);
      if(json.data.statusMember == "You are not a member of this room ")
      {
        console.log("ALLL GOOOOD FALSE ")
        setErrorMessage(" You are not a member of this room.");

        setAllgood(false);
      }
      if(json.data.statusMember  == "owner")
      {
        console.log("This is the owner of the room");
        // let obj = {
        //   statusmember: json.statusMember
        // }
        // var newobj = Object.assign({}, testRoom, {statusMember : json.statusMember});
        // setRoom("");
        // setRoom(newobj);
        // let AdminRoom = [
        //   ...testRoom,obj
        // ]
          // AdminRoom
    //       {
    //     statusmember:json.statusmember
    //         },
    // );
        // AdminRoom  = json.statusMember;
        // setRoom()
        // var newRoom = {...testRoom};
        setRoomPerm(json);
      setStatusMember("owner");
        SetUserAdmin(true);
      }
      else if(json.data.statusMember == "admin")
      {
        setStatusMember("admin");
        SetUserAdmin(true);
      }
      // if ()
      if(json.data.statusCode == "500" || IsAuthOk(json.data.statusCode) == 1)
        {
            console.log("an error occured");
            setErrorMessage("an error occured");
            setAllgood(false)
            // window.location.reload();
        }
        if(json.data.statusCode == "404")
        {
          if(json.data.message == "You are not a member of this room")
         { 
          setErrorMessage(" You are not a member of this room.");
          setAllgood(false);
        }
      //   if(json.data.message == "Already a member")
      //   { 
      //    setErrorMessage(" You are not a member of this room.");
      //    setAllgood(false);
      //  }
        }
        // else
        // {
        //   setAllgood(true);
        //   console.log("Setting the chatRoom Infos ...");
        //   return json;
        // }
     
  })
  .catch((error) => {
      console.log("An error occured  while fetching the Pemissions ! : " + error)
      setErrorMessage(" An error occured while fetching the room data . You are not a member of this room.");
      setAllgood(false);
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
      {testRoom.is_protected ? (
        <>
  HAS PASSWORD
  <br/>
  <Pop room={testRoom}/> 

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
      <AdminChatRoomDashboard room={testRoom} statusMember={roomPerm} />
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