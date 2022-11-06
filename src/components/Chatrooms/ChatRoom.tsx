import { Link, useParams } from 'react-router-dom';
import { chatRooms } from './ChatRoomData.js';

import './ChatRoom.css';
import ChatRoomBox from './ChatRoomBox'

function ChatRoom() {
    const params = useParams();

    const room = chatRooms.find((x) => x.id === params.id);
    if (!room) {
        // TODO: 404
    }

    return (
        <div className='ChatRoomMessageBox'>
            <h2>{room.title}</h2>
            <h2><ChatRoomBox room={room}
            /></h2>
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