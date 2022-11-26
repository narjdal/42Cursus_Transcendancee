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
    const [userAdmin,SetUserAdmin] = useState(false);
    const room = chatRooms.find((x) => x.id === params.id);
    
    if (!room) {
        // TODO: 404
    }
    useEffect (() => {
        const loggeduser = localStorage.getItem("user");
    
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          const {id} = Current_User;
                console.log("ID IS " + id);
          // console.log("=>>>>> FROM THE Chatroom "   + Current_User.nickname + " ID IS =  " +  Current_User.id +  + "This room Owner Id  is :> " + room.OwnerId)
        //   var help = JSON.parse(room.AdminsIds);
          console.log("=>>> " +room.AdminsIds);

          if(id== room.AdminsIds || id == room.OwnerId)
          {
          SetUserAdmin(true);
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

            {userAdmin ? (
                <div>
                  <AdminChatRoomDashboard room={room}/>
                    </div>
            ) : (
                <div>
                    
                    </div>
            )}
            <div>
                <li><Link to="/Landing">⬅️ Back to all rooms</Link> </li>
            </div>
            <div className="messages-container">
                                {/* TODO */}
            </div>
            </div>
    );
}

export { ChatRoom };