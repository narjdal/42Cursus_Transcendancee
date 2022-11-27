import react from 'react';
import { useState ,useEffect} from "react";
import './ChatRoomButtons.css'
import DisplayChatRoomusers from './DisplayChatRoomsusers';
import person from '../users/users.json'
import { useParams } from 'react-router-dom';

const ChatRoomButton = () => {
  const[friends,setFriends] = useState <any >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const params = useParams();
const [username, setUsername] = useState("");
const HandleBanUser = () => {

};
const HandleMuteUser = () => {

};
const HandleBlockUser = () => {

};


async function FetchUserInfo (nickname) {

  // ]
// const loggeduser = localStorage.getItem("user");

// if(loggeduser)
// {
// var Current_User = JSON.parse(loggeduser);
// const text = "http://localhost:5000/player/listOfFriends";
const text = ("http://localhost:5000/player/listToAddFriend/" + params.id);
console.log("Api Fetch Link :  =>  " + text);


await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  console.log("The response is => " + JSON.stringify(json))
if(json.statusCode == "500")
{
  console.log("An error occured in the backend.");
}
else
setFriends(json);


  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
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


async function InviteFriendToRoom () {
  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
{
  const current = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/addMember/" + current.nickname + "/" + username
console.log("Api Fetch Link :  =>  " + text);


await fetch(text,{
  // mode:'no-cors',
  method:'get',
  credentials:"include"
})

.then((response) => response.json())
.then(json => {
  console.log("The response is => " + JSON.stringify(json))
// 
if(json.statusCode == "500")
{
  setErrorMessage("An error occured in the backend.");
}

  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
}

};

const HandleInviteToRoom = (e) => {
  e.preventDefault();
  console.log("Inviting this user to the chatroom " + username)

  if(username)
  {
    InviteFriendToRoom();
  }
  else
  {
    setErrorMessage("Please enter a valid nickname");
  }
}
const FilteredUsers = friends.filter(friends => {
    // Here A changer : person with friends from backend , 
    //filter nickname not name 
     return friends.nickname.toLowerCase().includes(username.toLowerCase());
  })
    return (
        <div className='ChatRoomButtons-container'>
        {errorMessage && <div className="error"> {errorMessage} </div>}
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