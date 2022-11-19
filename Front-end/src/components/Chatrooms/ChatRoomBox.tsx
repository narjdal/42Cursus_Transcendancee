import React from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useState,useEffect } from "react";
import person from '../users/users.json'
import './ChatRoomBox.css'
import MessageList from '../DirectMsg/MessageList';
import DisplayChatRoomusers from './DisplayChatRoomsusers';
import axios from 'axios';
//https://codeburst.io/tutorial-how-to-build-a-chat-app-with-react-native-and-backend-9b24d01ea62a
const ChatRoomBox = (props) => {
  const users = [{ username: "Jane", password: "testpassword" ,ChatRoomBox: ""}];
  const [inputMsg,SetInputMsg] = useState("");
  const [userfetched,setUserFetched] = useState("");

  const [BanUser,SetBanUser] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [Updated, setisUpdated] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
  const[friends,setFriends] = useState <any >([]);

  const [user42,SetUser42] = useState<any>([])
  const [UserAdmin,SetUserAdmin] = useState(false);

  const MsgHistory = [
    {id:0,userId:1,username:"narjdal",msg:"salut"},
    {id:1,userId:1,username:"narjdal",msg:"ca  va ?"},
    {id:2,userId:2,username:"test",msg:"oui et toi "},
    {id:3,userId:1,username:"narjdal",msg:"on fait une game "},
    {id:4,userId:2,username:"test",msg:"vasy "},
    {id:7,userId:3,username:"user3",msg:"Just joined"},
    {id:6,userId:3,username:"user3",msg:"Hi"},
    {id:8,userId:3,username:"user3",msg:" ss"},
    {id:10,userId:3,username:"user3",msg:"oo"},
    {id:11,userId:3,username:"user3",msg:"oo"},
    {id:12,userId:3,username:"user3",msg:"oo"},
    {id:13,userId:3,username:"user3",msg:"oo"},

  ];
//GEt Request to Backend to get Message History of the room 
var MsgList =[...MsgHistory];

  const HandleInputMsg = (e) => {
    e.preventDefault();
    SetInputMsg(e.target[0].value);

    console.log("INPUT MSG => ",inputMsg);
    if (inputMsg)
    {
      //Post request to Backend
    }
  }
  const HandleBanUser = (e) => {
    e.preventDefault();
    SetBanUser(e.target[0].value);
  }


  async function FetchUserInfo (id) {

    // ]
  const loggeduser = localStorage.getItem("user");

  if(loggeduser)
{
  var Current_User = JSON.parse(loggeduser);
  const text = ("http://localhost:9000/GetUserPicture");
  console.log("Api get Link :  =>  " + text);
  
  const response = await axios.get("http://localhost:9000/GetUserPicture",{
  headers: {
    userId:id
  }
  }
  )
  const {nickname ,UserId,image_url,id42} = response.data;
  console.log("The Friends are " + JSON.stringify(response.data));
//   response.data.forEach( result => {
//     // console.log(result.data.name);
//     console.log(result.data.id);
//     console.log(result.data.image_url);
//     console.log(result.data.id42);

// })
    // console.log(" Nickname " + response.data[0].name + " IU => " + response.data[0].image_url  + " |id42 " + response.data[0].id42);
  // 	onUploadProgress: progressEvent => {
  // 		setLoaded(progressEvent.loaded / progressEvent.total!*100);
  // 	},
  // });
  
  // 	}
    return response.data;
}

  }
  useEffect (() => {
    const loggeduser = localStorage.getItem("user");

    if(loggeduser)
    {
      var Current_User = JSON.parse(loggeduser);
      let OwnedDbId = 1;
      // console.log("=>>>>> FROM THE Chatroom "   + Current_User.nickname + Current_User.UserId + OwnedDbId + "This room Owner Id  is :> " + room.OwnerId)
    //   var help = JSON.parse(room.AdminsIds);
    FetchUserInfo(2)
    .then((resp) => {
      console.log("resp => " + resp[0].id);
      setFriends(resp);
      console.log("user42.image_url" + friends.image_url)
    })
    console.log("=>>> " +props.room.AdminsIds);

      if(Current_User.UserId == props.room.AdminsIds)
      {
        console.log("User is Admin ! ");
      SetUserAdmin(true);
      }
    //   var new_User = [...Current_User];
      SetUser42(Current_User);
    }
},[localStorage.getItem("user")]);

const SendMessage = (e) => {
  e.preventDefault();
  setIsUpdating(true);
  setTimeout(() => {
    setIsUpdating(false);
    setisUpdated(true);
    setTimeout(() => setisUpdated(false), 2500);
    window.location.reload();
 
  }, 2000);

}

const HandleFetchedFriend = (e) => {
  e.preventDefault();
}
return (
  <div className='body'>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

    <div className='ChatRoomBox-card'>
      <h2>{props.room.title}</h2>
      <div className='ChatBox-container'>
          <div className='Users-container' >
          <div className='ChatRoomUsers-container' >
          <div className="search">
      <div className="searchForm">
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={event => setUserFetched(event.target.value)}
       value={userfetched || ""}
        />
        </div>
  </div>
  </div>

        {friends.map(c => < DisplayChatRoomusers key = {c.id} user = {c} />)}
  </div>
      <div className='History-Box'> 
     
      {MsgList.map(c => < MessageList  key = {c.id} user ={c} />)}
      </div>
  
  <form className='ChatRoom-Input-form' onSubmit={HandleInputMsg}>
    <div className='ChatRoom-InputBox'>
      <input type="text"
       className={`${inputMsg ? "has-value" : ""}`}
       id="textbox"
       placeholder='enter a message'
       onChange={event => SetInputMsg(event.target.value)}
       value={inputMsg || ""}
       /> 
      <label htmlFor="textbox"> 
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
       </label>
</div>
      
      {UserAdmin ? ( 
          <div>
             <input type="text"
       className={`${BanUser ? "has-value" : ""}`}
       id="textbox"
       onChange={event => SetBanUser(event.target.value)}
       value={BanUser || ""}
       /> 
      <label htmlFor="textbox"> Ban : </label>
      </div>
      ) : (
        <div>
          </div>
      )}
       <button
      onClick={SendMessage}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : "Send"}
      </span>
    </button>
    {errorMessage && <div className="error"> {errorMessage} </div>}

  </form>
  </div>
  </div>
  </div>
  )
};
export default ChatRoomBox;
