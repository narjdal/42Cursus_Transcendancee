import React, { useEffect } from "react";
import './Notifs.css'
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const Notifs = (props) => {
    console.log("Hello from notifs" ,props)
    const navigate = useNavigate();
    const HandleAcceptGame = (e) => {
        e.preventDefault();
        console.log("Accepting the game")

        // let socket = io("http://localhost:5000/game");

        // socket.on("connect",() => {
        //  console.log("Notif Socket  : ",socket);
        // })

        // socket.emit("AcceptGame",{
        //     sender:props.notifs.Sendernickname,
        //     user:localStorage.getItem("user")!
        //     // user:localStorage.getItem("user")!,
        //     // invite:userState.nickname
        //    })
        const obj = {
            sender : props.notifs.data.Sendernickname,
        }

        localStorage.setItem("AcceptGame",JSON.stringify(obj));
        window.location.href = "http://localhost:3000/Pong"

        // navigate('/Pong');
    }

useEffect(() => {

},[])
return (

    <div className="Notif-Card">
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
    </div>
)
}

export default Notifs;