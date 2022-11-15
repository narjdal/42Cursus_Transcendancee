import { Link, useParams } from 'react-router-dom';
import { chatRooms } from './ChatRoomData.js';

import './ChatRoom.css';
import ChatRoomBox from './ChatRoomBox'
import ChatRoomButton from './ChatRoomButtons'
import { useState ,useEffect} from "react";
import AdminChatRoomDashboard from './AdminChatRoomDashboard';
function ChatRoom() {
    const params = useParams();
    const [user42,SetUser42] = useState<any>([])
    const [UserOwnsRooms,SetUserOwnsRoom] = useState(false);
    const room = chatRooms.find((x) => x.id === params.id);
    
    if (!room) {
        // TODO: 404
    }
    useEffect (() => {
        const loggeduser = localStorage.getItem("user");
    
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          let OwnedDbId = 1;
          console.log("=>>>>> FROM THE Chatroom "   + Current_User.nickname + Current_User.UserId + OwnedDbId + "This room Owner Id  is :> " + room.OwnerId)
        //   var help = JSON.parse(room.AdminsIds);
          console.log("=>>> " +room.AdminsIds);

          if(Current_User.UserId == room.OwnerId)
          {
          SetUserOwnsRoom(true);
          }
        //   var new_User = [...Current_User];
          SetUser42(Current_User);
        }
},[]);
    return (
        <div className='ChatRoomMessageBox'>
            <h2>{room.title}</h2>
            <h2><ChatRoomBox room={room}
            /></h2>
            <ChatRoomButton/>
            {UserOwnsRooms ? (
                <div>
                  <AdminChatRoomDashboard/>
                    </div>
            ) : (
                <div>
                    
                    </div>
            )}
            <div>
                <li><Link to="/">⬅️ Back to all rooms</Link> </li>
            </div>
            <div className="messages-container">
                                {/* TODO */}
            </div>
            </div>
    );
}

export { ChatRoom };