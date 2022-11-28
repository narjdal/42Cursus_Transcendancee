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
    console.log("INSIDE MESSAGE LIST " + props.user.msg + " MSG USER ID " + props.user.id)
    if(loggeduser)
		{

		const Current_User = JSON.parse(loggeduser);
           const {id,avatar} = Current_User;
            // console.log("User is " + UserId +" props USER ID => "+ props.user.userId);
    SetCurrentUser(CurrentUser);
    SetUserId(id);
    SetImageUrl(image_url);
        }
  }, []);
    return (   
        <div className="MsgHistory">
          
        {UserId == props.user.senderId ? (
       <div className='YourMessages'>  
       <img src={props.user.avatar} className="avatar1" />     
    <span>{props.user.msg} </span>
        
    <span className="time-right">11:55</span>
        </div>
            ):(
 <div className="OthersHistory">
    <div className='OthersMessages'>

 <Link style={{color:'purple',float:'left'}} to={`/users/${props.user.senderId}`} >{props.user.nickname}</Link>
      {props.user.msg}
        
           {/* <p onClick={HandleRightClick} onContextMenu={HandleRightClick} > {props.user.msg} </p>
           {ShowActionsButtons ? (
            <div>
            <ChatRoomButton/>
            </div>
           ) : (
            <div>
                
                </div>
           )} */}
       
            <span className="time-left">11:99999</span>
            </div>
            </div>
            )}
            <br/>
        </div>

    );
};

export default MessageList;