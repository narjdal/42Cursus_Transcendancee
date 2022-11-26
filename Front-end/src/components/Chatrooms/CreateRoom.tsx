import react from 'react';
import { useState } from "react";
import './CreateRoom.css'
import person from '../users/users.json'

const CreateRoom = () => {
    
    const [RoomName,setRoomName] = useState("");
    const [RoomPassword,setRoomPassword] = useState("");
    const [RoomOwner,setRoomOwner] = useState("");
    const [isRoomPublic,setRoomPublic] = useState(false);
    const [isRoomPrivate,setRoomPrivate] = useState(false);
    const [isRoomProtected,setRoomProtected] = useState(false);
    const [roomState,setRoomState] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [user,setUser] = useState([]);
    const HandleRoomPublic = (e) => {
        setRoomPublic(!isRoomPublic);
        setRoomPrivate(false);
        setRoomProtected(false);
        setRoomState("Public");


    } 
    const HandleRoomPrivate = (e) => {
        setRoomPrivate(!isRoomPrivate);
        setRoomPublic(false);
        setRoomProtected(false);
        setRoomState("");
        setRoomState("Private");


        
    } 

    const HandleRoomProtected = (e) => {
        setRoomProtected(!isRoomProtected);
        setRoomPrivate(false);
        setRoomPublic(false);
        setRoomState("Protected");

    };
    async function CreateRoom ()  {

        const loggeduser = localStorage.getItem("user");
  
        if(loggeduser)
      {
        var Current_User = JSON.parse(loggeduser);
        const text = ("http://localhost:5000/player/createChatRoom/" );
        console.log("Api Fetch Link :  =>  " + text);

        
        console.log("creating this room : "  + roomState + " Name : " + RoomName + " Password : " + RoomPassword + " Owner : " + Current_User.nickname);
        await fetch(`http://localhost:5000/player/createChatRoom/${RoomName}`,{
          // mode:'no-cors',
          method:'post',
          credentials:"include",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
              { 
                roomState: roomState,
            RoomName: RoomName,
            RoomPassword: RoomPassword,}
              )
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
    };





    const HandleCreateRoom = (e) => {
        const user ="narjdal";
        e.preventDefault();
        setRoomOwner(user);
        console.log("Room infos  : " + RoomName+   " Room Password "+ RoomPassword);
    if(RoomName)
    {
        if(RoomPassword && isRoomProtected)
        {
            console.log("Setting a room with pws ! " + RoomPassword);
            setRoomState("protected");
        }
         if(isRoomPublic)
        {
            console.log("Setting a public room ! ");
            setRoomState("public");
        }
         if(isRoomPrivate)
        {
            console.log("Setting a private room ! ");
            setRoomState("private");
        }
        CreateRoom();
        // Here Post Request to Backend , with the Room infos  + creating use infos 
        // fetch(
		// 	'https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>',
		// 	{
		// 		method: 'POST',
		// 		body: formData,
		// 	}
		// )
		// 	.then((response) => response.json())
		// 	.then((result) => {
		// 		console.log('Success:', result);
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error:', error);
		// 	});

    }
    else
    {
        setErrorMessage("Please chose a valid Room Name ! ");

    }
    } 
 
    return (
        <div className="body">
         <div className='CreateRoom-card'>
            <h2> Room Settings : </h2>
        <form className='CreateRoom-form'>
      <input type="text"
       className="form-control" 
       placeholder="Room Name " 
       onChange={event => setRoomName(event.target.value)}
       value={RoomName || ""}
       />
       <h3>Channel Type : </h3>
         <input type="radio"
        value ="Public"
       placeholder="Room Name " 
       checked = {isRoomPublic}
       onChange={HandleRoomPublic}
       />
       Public
       <input type="radio"
        value ="Private"
       placeholder="Room Name " 
       checked = {isRoomPrivate}
       onChange={HandleRoomPrivate}
       />
       Private

       <input type="radio"
        value ="Protected"
       placeholder="Room Name " 
       checked = {isRoomProtected}
       onChange={HandleRoomProtected}
       />
       Protected
       
       {isRoomProtected ? (
        <input type="text"
        className="form-control" 
        placeholder="Room Password:   " 
        onChange={event => setRoomPassword(event.target.value)}
        value={RoomPassword || ""}
        />
        
        ) : (
            <div>

            </div>
        )
        
       }
        <button type ="submit" onClick={HandleCreateRoom}>Submit</button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
       </form>
       </div>
        </div>

    );
};

export default CreateRoom;