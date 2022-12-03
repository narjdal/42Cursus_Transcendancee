import React from "react";
import { Link } from "react-router-dom";
const DisplayRoomList =  (props) => {

    async function JoinRoom()
    {
     
      
      const text = "http://localhost:5000/player/joinRoom/" + props.room.id;
        console.log("THE  Join Room Link :  =>  " + text);
        
    
        await fetch(text,{
          // mode:'no-cors',
          method:'get',
          credentials:"include"
      })
      
      .then((response) => response.json())
      .then(json => {
          console.log("The Joining Room Response  is => " + JSON.stringify(json))
        //   setSuccess(true);
          if(json.statusCode == "")
    
          return json;
      })
      .catch((error) => {
          console.log("An error occured  while joinin the room " + error)
          return error;
      })
    
    }

    const HandleJoinRoom = (e) => {
        e.preventDefault();
        console.log("Joining this room ..." + props.room.id + " ROOM INFO : DM :  " + props.room.is_dm, + " PROTECTED ? : "  +  props.room.is_protected)
        if(!props.room.is_dm)
       { JoinRoom()
        .then((resp) => {
            console.log( " JOINING IS DONE ! ")
            // window.location.href="http:://localhost:3000/room/" + props.room.id;
    window.location.href = "http://localhost:3000/room/" + props.room.id;
            
        })}
        else
        {
    window.location.href = "http://localhost:3000/room/" + props.room.id;

        }
    }
    return (
        <>

            <ul className="chat-room-list">
        <li>
    {props.room.is_protected ? (
        <> 
           <button type="button" className='has-border' >
            <span className="icon material-symbols-outlined">
             {"lock"}    {  <Link to={`/room/${props.room.id}`}>{props.room.name}</Link> }    </span>
              </button> 
        </>
    ) : (
        <>
         <button 
         onClick={HandleJoinRoom}
                          
                  >
                      {/* <Link to={`/room/${props.room.id}`}>{props.room.name}</Link> */}
                    {props.room.name}
                      </button>
        </>
        
    )}
    </li>
            </ul>
        </>
    )
}

export default DisplayRoomList