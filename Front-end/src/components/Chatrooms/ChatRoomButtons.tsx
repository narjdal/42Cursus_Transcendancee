import react from 'react';
import { useState ,useEffect} from "react";
import './ChatRoomButtons.css'

const ChatRoomButton = () => {

const [username, setUsername] = useState("");
const HandleAddFriend = () => {

};
const HandleInviteGame = () => {

};
const HandleBlockUser = () => {

};
    return (
        <div className='ChatRoomButtons-container'>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user in the chatroom"
          onChange={event => setUsername(event.target.value)}
       value={username || ""}
        />
        <button type ="submit" > <img src ="/images/Add.png" className="FriendAddIcon" height="30"/></button>
            <button onClick={HandleAddFriend} className="ChatRoomButtons"  > Add as friend : </button>
            <button  onClick={HandleInviteGame}className='ChatRoomButtons' > Invite to play a game  : </button>
            <button  onClick={HandleBlockUser}className='ChatRoomButtons'> Block User   : </button>
        </div>
    );
}

export default ChatRoomButton;