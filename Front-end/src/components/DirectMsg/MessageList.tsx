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
       <img src={props.user.sender.avatar} className="avatar1" />   

    <p>  {props.user.msg} </p>
          
    <span className="time-right"> {props.user.createdAt}</span>
        </div>
            ):(
 <div className="OthersHistory">
    <div className='OthersMessages'>
    <img src={props.user.sender.avatar} className="avatar1" />     
 <Link style={{color:'purple',float:'left'}} to={`/users/${props.user.sender.nickname}`} >{props.user.sender.nickname} : </Link>
    <p>{props.user.msg}</p>
        
           {/* <p onClick={HandleRightClick} onContextMenu={HandleRightClick} > {props.user.msg} </p>
           {ShowActionsButtons ? (
            <div>
            <ChatRoomButton/>
            </div>
           ) : (
            <div>
                
                </div>
           )} */}
       
            <span className="time-left"> {props.user.createdAt}</span>
            </div>
            </div>
            )}
            <br/>
        </div>

    );
};

export default MessageList;