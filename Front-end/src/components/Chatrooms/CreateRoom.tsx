import react from 'react';
import { useState } from "react";
import './CreateRoom.css'
const CreateRoom = () => {
    
    const [RoomName,setRoomName] = useState("");
    const [RoomPassword,setRoomPassword] = useState("");
    const [RoomOwner,setRoomOwner] = useState("");
    const [isRoomPublic,setRoomPublic] = useState(false);
    const [isRoomPrivate,setRoomPrivate] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [user,setUser] = useState([]);
    const HandleRoomPublic = (e) => {
        setRoomPublic(!isRoomPublic);
        setRoomPrivate(false);
    } 
    const HandleRoomPrivate = (e) => {
        setRoomPrivate(!isRoomPrivate);
        setRoomPublic(false);

    } 
    const HandleCreateRoom = (e) => {
        const user ="narjdal";
        e.preventDefault();
        setRoomOwner(user);
        console.log("Room infos  : " + RoomName+   " Room Password "+ RoomPassword);
    if(RoomName)
    {
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
       
       {isRoomPrivate ? (
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