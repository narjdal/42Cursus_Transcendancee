import react from 'react';
import { useEffect, useState } from "react";
import {Link} from'react-router-dom';
import ChatRoomButton from '../Chatrooms/ChatRoomButtons'


import './MesageList.css'
const MessageList = (props) => {
    const[CurrentUser,SetCurrentUser] = useState<any>([]);
    const [ShowActionsButtons,SetActionsButtons] = useState(false);
    const [UserId,SetUserId] = useState("");
    const [image_url,SetImageUrl] = useState("");
    const HandleRightClick = (e) => {
        e.preventDefault();
        if (e.type === 'click') {
            console.log('Left click');
          } else if (e.type === 'contextmenu') {
            console.log('Right click');
            SetActionsButtons(!ShowActionsButtons);
          }
        
    } ;
  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    const loggeduser = (localStorage.getItem("user")!);
    // if(props.user.userId == 0)
    // {
    // }
    if(loggeduser)
		{

		const Current_User = JSON.parse(loggeduser);
           const {UserId,image_url} = Current_User;
            // console.log("User is " + UserId +" props USER ID => "+ props.user.userId);
    SetCurrentUser(CurrentUser);
    SetUserId(UserId);
    SetImageUrl(image_url);
        }
  }, []);
    return (   
        <div className="MsgHistory">
        {UserId == props.user.userId ? (
       <div className='YourMessages'>  
       <img src={props.user.image_url} className="avatar1" />     
    <span>{props.user.msg} </span>
        
    <span className="time-right">11:00</span>
        </div>
            ):(
        <div className="MsgHistory">
    <div className='OthersMessages'>
        
    <span><Link style={{color:'grey'}} to={`/users/${props.user.userId}`} >{props.user.username}</Link> </span>
           
           <p onClick={HandleRightClick} onContextMenu={HandleRightClick} > {props.user.msg} </p>
           {ShowActionsButtons ? (
            <div>
            <ChatRoomButton/>
            </div>
           ) : (
            <div>
                
                </div>
           )}
       
            <span className="time-left">11:00</span>
            </div>
            </div>
            )}
            <br/>
        </div>

    );
};

export default MessageList;