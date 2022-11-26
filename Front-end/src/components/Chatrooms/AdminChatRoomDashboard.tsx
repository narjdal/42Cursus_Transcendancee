import react from 'react';
import { useState ,useEffect} from "react";
import './AdminChatRoomDashboard.css'
import DisplayChatRoomusers from './DisplayChatRoomsusers';
import person from '../users/users.json'

const AdminChatRoomDashboard = (props) => {
  const[roomUsers,setRoomUsers] = useState <any >([]);
const [username, setUsername] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const [showmodal,setModal] = useState(false);
const[muteTime,setMuteTime] = useState("0:00");
const [time, setTime] = useState<any>("");
const [owner,setOwner] = useState("");
const [open_rs,setOpenRs] = useState(false);
const[msg,setMsg] = useState("");
const [haspassword,setHasPassword] = useState(false);
const [ispublic,setisPublic] = useState(false);
const [Roompassword,setRoompassword] = useState("");
const [isUpdating, setIsUpdating] = useState(false);
const [Updated, setisUpdated] = useState(false);

const HandleAddUserAdmin = () => {


};

const HandleAddAdmin = (e ) => {
    e.preventDefault();
    console.log("adding this user to be admin ...." + username);
    setErrorMessage("Could not find this user ! Are you sure u spelled it correcly ? ");
}
const HandleMute = (e) => {
    e.preventDefault();
    setModal(!showmodal)
}

const FilteredUsers = person.filter(person => {
    // Here A changer : person with friends from backend , 
    //filter nickname not name 
    return person.nickname.toLowerCase().includes(username.toLowerCase());
  })
  useEffect(() => {
    setErrorMessage("");
  },[username])

  const HandleMuteRequest = (e) => {
    e.preventDefault();
    console.log( username + " Will be  muted for : " + time);
    setErrorMessage("An error occured !");
  }
  const HandleRoomSettings = (e) => {
    e.preventDefault();
    setOpenRs(!open_rs)

  }
  const HandleBanUser = (e) => {
    e.preventDefault();
    console.log( username + " Will be  banned ! ");
    setErrorMessage("An error occured !");
  }
  const HandleRoomPublic = (e) => {
    e.preventDefault();
    setisPublic(true);
    setHasPassword(false);
    // setRoomPublic(!isRoomPublic);
    // setRoomPrivate(false);
} 
const HandleRoomPrivate = (e) => {
  e.preventDefault();

    // setRoomPrivate(!isRoomPrivate);
    // setRoomPublic(false);
    setisPublic(false);
    setHasPassword(true);

} 
  useEffect(() => {
    
    const loggedUser  =localStorage.getItem("user");
    if(loggedUser)
    {
      const current = JSON.parse(loggedUser);
       const {id} = current;
      console.log("THE ID USEEFFECT IS " + id + "  ROOM ID " + "RoomOwnerId : " + props.room.OwnerId);
      // In JS == Ignores the Data Types 
      // === Check condition + data types then true 
      if(props.room.OwnerId == id)
      {
        console.log(" i am owenr")

        setOwner("true");
      }

      if(props.room.AdminIds == id)
      {
        console.log(" i am Admin")

        setOwner("true");
      }

      //https://stackoverflow.com/questions/43309712/how-to-check-if-a-value-is-not-null-and-not-empty-string-in-js
      //
        //@Boolean Values that are intuitively “empty”, like 0, an empty string, null, undefined, and NaN, become false
//Other values become true

      //
      if((!props.room.password))
      {
        console.log("Room has no password ! should not be  protected");
        setMsg("Your room is public ! ");
        setisPublic(true);
        setHasPassword(false);
      }
      else 
      {
        console.log("Room has a password ! should be protected");
        setMsg("Your room is protected with a password ");
        setisPublic(false);
        setHasPassword(true);

      }
    }
  },[])
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
        <div className='ChatRoomAdminDash-container'>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user in the chatroom"
          onChange={event => setUsername(event.target.value)}
       value={username || ""}
        />
        {errorMessage && <div className="error"> {errorMessage} </div>}

        {username ? (
            <>
{FilteredUsers.map(c => < DisplayChatRoomusers key = {c.id} user = {c} />)}

            </>
        )  : (
            <>
            </>
        )}


      <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleBanUser}>
    <span className="icon material-symbols-outlined">
     {"Block"}  
      </span>
      <span> Ban User  </span>
      </button>

      <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleMute}>
    <span className="icon material-symbols-outlined">
     {"Mic_Off"}  
      </span>
      <span> Mute   </span>
      </button>
      {showmodal ? (
        <>
        <input
         type="time" 
         id="mute"
          name="mute-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        //   onChange={HandleChange}
        //   onChange={event => setTime(event.target.value)};
        min="00:00" max ="18:00" >

        </input>
        <label htmlFor="mute"> Chose Mute Duration</label>
      
        <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleMuteRequest}>
    <span className="icon material-symbols-outlined">
     {"double_arrow"}  
      </span>
      </button>
        </>
      ) : (
        <>
        </>
      )}
      {owner === "true" ? (
<>
<button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleAddAdmin}>
    <span className="icon material-symbols-outlined">
     {"admin_panel_settings"}  
      </span>
      <span> Add As Admin  </span>
      </button>
      
<button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleRoomSettings}>
    <span className="icon material-symbols-outlined">
     {"Settings"}  
      </span>
      <span> Room Settings</span>
      </button>
      {open_rs ? (
        <>
   {/* <input type="text"
       className="form-control" 
       placeholder="Room Name " 
       onChange={event => setRoomName(event.target.value)}
       value={RoomName || ""}
       /> */}
       <h3>Channel Type : </h3>
       <span>{msg}</span>
         <input type="radio"
        value ="Public"
       placeholder="Room Name " 
       checked = {ispublic}
       onChange={HandleRoomPublic}
       />
       Public 
       <input type="radio"
        value ="Password"
       placeholder="Room Name " 
       checked = {haspassword}
       onChange={HandleRoomPrivate}
       />
       Set a Password

       {haspassword ? (
          <>
            <input type="password"
       className={`${Roompassword ? "has-value" : ""}`}
	   id="textbox"
       onChange={event => setRoompassword(event.target.value)}
       value={Roompassword || ""}
       />


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
        </>
      )}
</>
      ) : (
<>
</>
      )}
       
        </div>

    );
};

export default AdminChatRoomDashboard;