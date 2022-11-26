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


async function FetchUserInfo (nickname) {

  // ]
const loggeduser = localStorage.getItem("user");

if(loggeduser)
{
var Current_User = JSON.parse(loggeduser);
const text = ("http://localhost:5000/player/listOfFriends");
console.log("Api Fetch Link :  =>  " + text);


await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  console.log("The response is => " + JSON.stringify(json))
setFriends(json);

  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

}
}
useEffect(() => {
  const loggeduser = localStorage.getItem("user");

  if(loggeduser)
{
  var Current_User = JSON.parse(loggeduser);
  const {id} = Current_User
  console.log("Fetching Friends of this User " + Current_User.nickname);
  FetchUserInfo(Current_User.nickname);
}
},[]);

const HandleInviteToRoom = (e) => {
  e.preventDefault();
}
const FilteredUsers = friends.filter(friends => {
    // Here A changer : person with friends from backend , 
    //filter nickname not name 
     return friends.nickname.toLowerCase().includes(username.toLowerCase());
  })
    return (
        <div className='ChatRoomButtons-container'>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user in your"
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
        <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleInviteToRoom}>
    <span className="icon material-symbols-outlined">
     {"group_add"}  
      </span>
      <span> Add a friend to the chatroom</span>
      </button>
           


        </div>
    );
}

export default ChatRoomButton;