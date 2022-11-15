import React from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useState,useEffect } from "react";
import person from '../users/users.json'
import './ChatRoomBox.css'
import MessageList from '../DirectMsg/MessageList';
//https://codeburst.io/tutorial-how-to-build-a-chat-app-with-react-native-and-backend-9b24d01ea62a
const ChatRoomBox = (props) => {
  const users = [{ username: "Jane", password: "testpassword" ,ChatRoomBox: ""}];
  const [inputMsg,SetInputMsg] = useState("");
  const [BanUser,SetBanUser] = useState("");

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
  useEffect (() => {
    const loggeduser = localStorage.getItem("user");

    if(loggeduser)
    {
      var Current_User = JSON.parse(loggeduser);
      let OwnedDbId = 1;
      // console.log("=>>>>> FROM THE Chatroom "   + Current_User.nickname + Current_User.UserId + OwnedDbId + "This room Owner Id  is :> " + room.OwnerId)
    //   var help = JSON.parse(room.AdminsIds);
      console.log("=>>> " +props.room.AdminsIds);

      if(Current_User.UserId == props.room.AdminsIds)
      {
        console.log("User is Admin ! ");
      SetUserAdmin(true);
      }
    //   var new_User = [...Current_User];
      SetUser42(Current_User);
    }
},[]);
return (
  <div className='body'>
    <div className='ChatRoomBox-card'>
      <h2>{props.room.title}</h2>
      <div className='History-Box'> 
      {MsgList.map(c => < MessageList  key = {c.id} user ={c} />)}
      </div>
      <form className='ChatRoom-Input-form' onSubmit={HandleInputMsg}>
      <input type="text"
       className={`${inputMsg ? "has-value" : ""}`}
       id="textbox"
       onChange={event => SetInputMsg(event.target.value)}
       value={inputMsg || ""}
       /> 
      <label htmlFor="textbox"> Message: </label>
      

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
      )


      }
 
  </form>
  </div>
  </div>
  )
};
export default ChatRoomBox;
