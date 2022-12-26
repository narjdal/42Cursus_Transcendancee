import React, { useEffect } from "react";
import './Notifs.css'
import { useNavigate } from "react-router-dom";

const Notifs = (props) => {
    const navigate = useNavigate();
    const HandleAcceptGame = (e) => {
        e.preventDefault();
        console.log("Accepting the game")
        const obj = {
            sender : props.notifs.data.Sendernickname,
        }
        localStorage.setItem("AcceptGame",JSON.stringify(obj));
        window.location.href = process.env.REACT_APP_FRONT_URL + "/Pong"
    }

useEffect(() => {

},[])
return (
<>
<ul className="chat-room-list">
        <li>
    {props.notifs.data.Sendernickname} has send you an invitation to play a game ! 
    <br/>
    <button type="button" id="ss" className='' onClick={HandleAcceptGame}>
    <span className="icon material-symbols-outlined">
     {"stadia_controller"}  
      </span>
      <span> Accept  </span>
      </button>
      </li>
      </ul>
      </>
)
}

export default Notifs;