import React from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useState } from "react";
import person from '../users/users.json'
import './ChatRoomBox.css'
import MessageList from '../DirectMsg/MessageList';
//https://codeburst.io/tutorial-how-to-build-a-chat-app-with-react-native-and-backend-9b24d01ea62a
const ChatRoomBox = (props) => {
  const users = [{ username: "Jane", password: "testpassword" ,ChatRoomBox: ""}];
  const [inputMsg,SetInputMsg] = useState("");


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
return (
  <div className='body'>
    <div className='ChatRoomBox-card'>
      <h2>{props.room.title}</h2>
      <div className='History-Box'> 
      {MsgList.map(c => < MessageList  key = {c.id} user ={c} />)}
      </div>
      <form className='ChatRoom-Input-form' onSubmit={HandleInputMsg}>
      <div className="md-textbox">
      <input type="text"
       className={`${inputMsg ? "has-value" : ""}`}
       id="textbox"
       onChange={event => SetInputMsg(event.target.value)}
       value={inputMsg || ""}
       /> 
      <label htmlFor="textbox"> Message: </label>
      </div>
 
  </form>
  </div>
  </div>
  )
};
export default ChatRoomBox;
