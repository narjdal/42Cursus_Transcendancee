import react from 'react';
import { useState ,useEffect} from "react";
import './AdminChatRoomDashboard.css'
const AdminChatRoomDashboard = () => {

const [username, setUsername] = useState("");

const HandleAddUserAdmin = () => {

};
    return (
        <div className='ChatRoomAdminDash-container'>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user in the chatroom"
          onChange={event => setUsername(event.target.value)}
       value={username || ""}
        />
        <button type ="submit" > <img src ="/images/Add.png" className="FriendAddIcon" height="30"/></button>
            <button  className='AdminDashButtons'> Add An  User as Administrateur    : </button>
        </div>

    );
};

export default AdminChatRoomDashboard;