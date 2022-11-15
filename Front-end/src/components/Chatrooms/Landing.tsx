import { chatRooms } from './ChatRoomData.js';
import {Link} from'react-router-dom';
import {Routes, Route, useNavigate} from 'react-router-dom';

import './Landing.css'
function Landing() {
    const navigate = useNavigate();
    const HandleClick = (e) => {
        navigate('/CreateRoom')
    };
    return (
        <>
        <div className='ChatRooms-card'>
            <h2> Join a ChatRoom </h2>
           <button className='CreateChatRoom-button' onClick={HandleClick}> Create a Chat Room </button>
            <ul className="chat-room-list">
                {chatRooms.map((room) => (
                    <li key={room.id}>
                    <Link to={`/room/${room.id}`}>{room.title}</Link>
                    </li>
                ))}
            </ul>
            </div>
        </>
    );
}

export { Landing };