import react from 'react';
import { useState ,useEffect} from "react";
import './ChatRoomButtons.css'
import DisplayChatRoomusers from './DisplayChatRoomsusers';
import person from '../users/users.json'

const ChatRoomButton = () => {
  const[friends,setFriends] = useState <any >([]);
const [username, setUsername] = useState("");
const HandleBanUser = () => {

};
const HandleMuteUser = () => {

};
const HandleBlockUser = () => {

};
useEffect(() => {
  const loggeduser = localStorage.getItem("user");

  if(loggeduser)
{
  var Current_User = JSON.parse(loggeduser);
  const {id} = Current_User
  console.log("Fetching Friends of this User " + Current_User.nickname);
}
})
const FilteredUsers = person.filter(person => {
    // Here A changer : person with friends from backend , 
    //filter nickname not name 
     return person.name.toLowerCase().includes(username.toLowerCase());
  })
    return (
        <div className='ChatRoomButtons-container'>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user in the chatroom"
          onChange={event => setUsername(event.target.value)}
       value={username || ""}
        />
        {username ? (
<>
{FilteredUsers.map(c => < DisplayChatRoomusers key = {c.id} user = {c} />)}

</>
        ) : (
<>
</>
        )}
            <button onClick={HandleBanUser} className="ChatRoomButtons"  > Ban  an user  : </button>
            <button  onClick={HandleMuteUser}className='ChatRoomButtons' > Mute an  user  :  </button>
            <button  onClick={HandleBlockUser}className='ChatRoomButtons'> Add as Admin User   : </button>
            <button type="button" id="ss" className='ButtonSocial-mute' onClick={HandleMuteUser}>


      </button> 
        </div>
    );
}

export default ChatRoomButton;