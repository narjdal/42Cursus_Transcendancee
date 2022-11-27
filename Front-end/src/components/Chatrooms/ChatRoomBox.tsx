import React, { useMemo } from 'react';
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
  const [userQuery,setUserQuery] = useState("");
  const [user42,SetUser42] = useState<any>([])
  const [UserAdmin,SetUserAdmin] = useState(false);


  const HandleBlock = (e) => {
    e.preventDefault();
    console.log("Handle Ban Click !" + BanUser);

  }
  const handleFriendClick  = (e) => {
    e.preventDefault();
    console.log("Handle Mute Click !" + BanUser);
  };
  
    const[chatroomUsers,Setchatroomusers] = useState<any>([]);
  const MsgHistory = [
    {id:1,userId:3},
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


//   async function FetchUserInfo (id) {

//     // ]
//   const loggeduser = localStorage.getItem("user");

//   if(loggeduser)
// {
//   var Current_User = JSON.parse(loggeduser);
//   const text = ("http://localhost:9000/GetUserPicture");
//   console.log("Api get Link :  =>  " + text);
  
//   const response = await axios.get("http://localhost:9000/GetUserPicture",{
//   headers: {
//     userId:id
//   }
//   }
//   )
//   const {nickname ,UserId,image_url,id42} = response.data;
//   console.log("The Friends are " + JSON.stringify(response.data));
// //   response.data.forEach( result => {
// //     // console.log(result.data.name);
// //     console.log(result.data.id);
// //     console.log(result.data.image_url);
// //     console.log(result.data.id42);

// // })
//     // console.log(" Nickname " + response.data[0].name + " IU => " + response.data[0].image_url  + " |id42 " + response.data[0].id42);
//   // 	onUploadProgress: progressEvent => {
//   // 		setLoaded(progressEvent.loaded / progressEvent.total!*100);
//   // 	},
//   // });
  
//   // 	}
//     return response.data;
// }

//   }
  useEffect (() => {
    const loggeduser = localStorage.getItem("user");

    if(loggeduser)
    {
      var Current_User = JSON.parse(loggeduser);
      let OwnedDbId = 1; 
      console.log("INSIDE CHATROOMBOX " + props.room.is_dm)

        // HERE request to backend to fetch users of the room
      // console.log("=>>>>> FROM THE Chatroom "   + Current_User.nickname + Current_User.UserId + OwnedDbId + "This room Owner Id  is :> " + room.OwnerId)
    //   var help = JSON.parse(room.AdminsIds);
    // FetchUserInfo(2)
    // .then((resp) => {
    //   console.log("resp => " + resp[0].id);
    //   setFriends(resp);
    //   console.log("user42.image_url" + friends.image_url)
    // })
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

async function LeaveRoom () {

  const text = "http://localhost:5000/player/leaveRoom/" +"me"  + "/" + props.room.id
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
};

const HandleLeaveRoom = (e) => {
  e.preventDefault();
  console.log("Handle Leave Room Click !" );
  LeaveRoom();

}
const HandleFetchedFriend = (e) => {
  e.preventDefault();
}

//-----------------------//
//Filter User List 
// const FilteredUsers =  useMemo (() => {
  const FilteredUsers = person.filter(person => {
  // Here A changer : person with friends from backend , 
  //filter nickname not name 
   return person.name.toLowerCase().includes(userQuery.toLowerCase());
})
console.log("PROPS IS DM " + props.room.is_dm);
return (
  <div className='body'>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />

    <div className='ChatRoomBox-card'>
      <div className='ChatBox-container'>
        {props.room.is_dm ? (
          <>

          </> ) : (
            <>
                   <div className='Users-container' >
          <div className='ChatRoomUsers-container' >
          <div className="search">
      <div className="searchForm">
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={event => setUserQuery(event.target.value)}
       value={userQuery || ""}
        />

    {FilteredUsers.map(c => < DisplayChatRoomusers key = {c.id} user = {c} isadmin ={"true"} />)}

        </div>
  </div>
  </div>
  </div>

            </>
          )}
     
      <div className='History-Box'> 
     
      {MsgList.map(c => < MessageList  key = {c.id} user ={c} />)}
 
      
      </div>
      {props.room.is_dm  ? (
        <>

        </>
        ) : (
          <>
             <button type="button" onClick={HandleLeaveRoom} style={{bottom:0}}>
                    <span className="icon material-symbols-outlined">
     {"logout"} 
      </span>
      <span> Leave Room</span>
                  </button>
          </>)}
   
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
      <div className='admin-buttons'>
      {/* <input type="text"
       className={`${BanUser ? "has-value" : ""}`}
       id="textbox"
       onChange={event => SetBanUser(event.target.value)}
       value={BanUser || ""}
       />  */}
    
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
