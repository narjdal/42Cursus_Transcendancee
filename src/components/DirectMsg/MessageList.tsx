import react from 'react';
import { useEffect, useState } from "react";

import './MesageList.css'
const MessageList = (props) => {
    const[CurrentUser,SetCurrentUser] = useState<any>([]);
    const [UserId,SetUserId] = useState("");
    const [image_url,SetImageUrl] = useState("");
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
            console.log("User is " + UserId +" props USER ID => "+ props.user.userId);
    SetCurrentUser(CurrentUser);
    SetUserId(UserId);
    SetImageUrl(image_url);
        }
  }, []);
    return (   
        <div className="MsgHistory">
        {UserId == props.user.userId ? (
       <div className='YourMessages'>  
       <img src={image_url} height="25"/>     
    You :{props.user.msg}
        
    <span className="time-right">11:00</span>
        </div>
            ):(
        <div className="MsgHistory">
    <div className='OthersMessages'>
       <p>{props.user.username}: 
            {props.user.msg}
            </p> 
            <span className="time-left">11:00</span>
            </div>
            </div>
            )}
            <br/>
        </div>

    );
};

export default MessageList;