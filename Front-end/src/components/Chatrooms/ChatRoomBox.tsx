import React, { useMemo } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import { useState,useEffect } from "react";
import person from '../users/users.json'
import './ChatRoomBox.css'
import MessageList from '../DirectMsg/MessageList';
import DisplayChatRoomusers from './DisplayChatRoomsusers';
import axios from 'axios';
import { IsAuthOk } from '../../utils/utils';
import { set } from 'date-fns';
//https://codeburst.io/tutorial-how-to-build-a-chat-app-with-react-native-and-backend-9b24d01ea62a
const ChatRoomBox = (props) => {

  const [inputMsg,SetInputMsg] = useState("");
  const [haspswd,setHaspswd] = useState(false);
  const [BanUser,SetBanUser] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [Updated, setisUpdated] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
  const[members,setMembers] = useState <any >([]);
  const [messages, setMessages] = useState <any>([]);
  const [showInput,setShowInput] = useState(false)

  const [userQuery,setUserQuery] = useState("");
  const [user42,SetUser42] = useState<any>([])
  const [UserAdmin,SetUserAdmin] = useState(false);
  const [allgood,setAllgood] = useState(false);



  const HandleBlock = (e) => {
    e.preventDefault();
    console.log("Handle Ban Click !" + BanUser);

  }
  const handleFriendClick  = (e) => {
    e.preventDefault();
    console.log("Handle Mute Click !" + BanUser);
  };
  
    const[chatroomUsers,Setchatroomusers] = useState<any>([]);
//   const MsgHistory = [
//     {id:1,userId:3},
//   ];
// //GEt Request to Backend to get Message History of the room 
// var MsgList =[...MsgHistory];

  const HandleInputMsg = (e) => {
    e.preventDefault();
    SetInputMsg(e.target[0].value);

    console.log("INPUT MSG => ",inputMsg);
    if (inputMsg)
    {
      //Post request to Backend
    }
  }
  const HandleBanUser = (e) => {
    e.preventDefault();
    SetBanUser(e.target[0].value);
  }


//   async function FetchUserInfo (id) {

//     // ]
//   const loggeduser = localStorage.getItem("user");

//   if(loggeduser)
// {
//   var Current_User = JSON.parse(loggeduser);
//   const text = ("http://localhost:9000/GetUserPicture");
//   console.log("Api get Link :  =>  " + text);
  
//   const response = await axios.get("http://localhost:9000/GetUserPicture",{
//   headers: {
//     userId:id
//   }
//   }
//   )
//   const {nickname ,UserId,image_url,id42} = response.data;
//   console.log("The Friends are " + JSON.stringify(response.data));
// //   response.data.forEach( result => {
// //     // console.log(result.data.name);
// //     console.log(result.data.id);
// //     console.log(result.data.image_url);
// //     console.log(result.data.id42);

// // })
//     // console.log(" Nickname " + response.data[0].name + " IU => " + response.data[0].image_url  + " |id42 " + response.data[0].id42);
//   // 	onUploadProgress: progressEvent => {
//   // 		setLoaded(progressEvent.loaded / progressEvent.total!*100);
//   // 	},
//   // });
  
//   // 	}
//     return response.data;
// }

//   }
async function GetMembers () 
{


  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/listOfMembers/" + props.room.id;
    console.log("Api Fetch Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      console.log(" Members Of ChatRoom  :   => " + JSON.stringify(json))
      // setMessages(json);
      // setRoom(json);
      // if(json.is_dm == true)
      // {
      //   testRoom.is_dm = true;
      //   console.log("This is a DM Room");
      
      //   setAllgood(true)
      //   setIsDm(true);
      // }
      if(json == 1)
      {
        console.log("weird");
        return ;
      }
      else if (json == 4 || json == 3)
      {
        console.log("Id received instead of user infos.")
        return ;
      }
    
      if(json.statusCode == "500" )
        {
            console.log("an error occured");
            setErrorMessage("an error occured");
            setAllgood(false)
            if(IsAuthOk(json.statusCode) == 1)
            window.location.reload();
        }

        else
        {
          setAllgood(true);
          setMembers(json);
          // setMembers(json)
          console.log("Setting the ChatRooms Members ...");
          return json;
        }
     

  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

    }
}

async function GetMessageHistory()
{
  const loggeduser = localStorage.getItem("user");
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
  const text = "http://localhost:5000/player/getmessages/" + props.room.id;
    console.log("Api getmessages Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      console.log("getmessages :   => " + JSON.stringify(json))
      
    
      if(json.statusCode == "500" || json.statusCode == "404")
        {
            console.log("an error occured");
            setErrorMessage("an error occured");
            setAllgood(false)
            // if(IsAuthOk(json.statusCode) == 1)
            // window.location.reload();
        }

        else
        {
          setMessages(json);
          setAllgood(true);
          console.log("Setting the ChatRooms Members ...");
          return json;
        }
     

  })
  .catch((error) => {
      console.log("An error occured  get Message: " + error)
      return error;
  })

    }
}



async function FetchRelationship() {

  const loggeduser = localStorage.getItem("user");
  if (loggeduser) {
    const current = JSON.parse(loggeduser);
    console.log("Fetching Relationship    Infos   => "  + "isghioua " + " I am : " + current.nickname + " This is hard coded waiting for getroombyid ");

    let endpoint = 'http://localhost:5000/player/statusFriendship/'
    // let nicknametofetch: string = JSON.stringify(params.nickname);
    // console.log(" this endpoint   " + endpoint + " Fetching : " + nicknametofetch)
    http://localhost:5000/statusFriendship/?id=narjdal

    await fetch((`http://localhost:5000/player/statusFriendship/isghioua`
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })



      .then((response) => response.json())
      .then(json => {
        console.log("The Realtionship is => " + JSON.stringify(json))
        setErrorMessage("");
        if(json == "blockFriend")
        {
          setShowInput(true);
        }
        else
        {
          // setShowInput(true);
          console.log(" NO INPUT TO SHOW SORRY ")
        setShowInput(false);
        setErrorMessage("You are not friend with this user  \n You can't send him a message ! ")
       }
        // localStorage.setItem("usertoshow",JSON.stringify(json));
        // localStorage.setItem("choice", json);
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        // setRelation("error");
        setErrorMessage("An error occured! Relationship not found ! ");
        return error;
      })

  }

}
  useEffect (() => {


      console.log("INSIDE CHATROOMBOX  ID  :  " + props.room.id + " NANE : " + props.room.name)

        // HERE request to backend to fetch users of the room
        if(!props.room.is_dm)
        {
          console.log("Fethcing members of this chatroom.");
          GetMembers();
        }
        else if (props.room.is_dm)
        {
          console.log("Fethcing Relationship of this chatroom.");
         FetchRelationship();
        }
      
        GetMessageHistory();
        // console.log("Members of the room : " + JSON.stringify(chatroomUsers));
    
},[]);

const SendMessage = (e) => {
  e.preventDefault();
  setIsUpdating(true);
  setTimeout(() => {
    setIsUpdating(false);
    setisUpdated(true);
    setTimeout(() => setisUpdated(false), 2500);
    window.location.reload();
 
  }, 2000);

}

async function LeaveRoom () {

  const text = "http://localhost:5000/player/leaveRoom/" + props.room.id
console.log("Api Leave Rookm  Link :  =>  " + text);


await axios.get(text,{withCredentials:true})
  //{
//   // mode:'no-cors',
//   method:'get',
//   credentials:"include"
// })

// .then((response) => response.json())
.then(json => {
  console.log("json" + JSON.stringify(json.data))
  // console.log("The response is => " + JSON.stringify(json))
// 
if(json.data.statusCode == "500" || IsAuthOk(json.data.statusCode) == 1)
{
  setErrorMessage("An error occured in the backend.");
  window.location.reload();
}


  return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  return error;
})

// }
};

const HandleLeaveRoom = (e) => {
  e.preventDefault();
  console.log("Handle Leave Room Click !" );
  LeaveRoom();

}
const HandleFetchedFriend = (e) => {
  e.preventDefault();
}

//-----------------------//
//Filter User List 
// const FilteredUsers =  useMemo (() => {
//   const FilteredUsers = members.filter(members => {
//   // Here A changer : person with friends from backend , 
//   //filter nickname not name 
//    return members.name.toLowerCase().includes(userQuery.toLowerCase());
// })
// console.log("PROPS IS DM " + props.room.is_dm);
return (
  <div className='body'>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
   
        <>
    <div className='ChatRoomBox-card'>
      <div className='ChatBox-container'>
        {props.room.is_dm ? (
          <>

          </> ) : (
            <>
                   <div className='Users-container' >
          <div className='ChatRoomUsers-container' >
          <div className="search">
      <div className="searchForm">
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={event => setUserQuery(event.target.value)}
       value={userQuery || ""}
        />

    {members.map(c => < DisplayChatRoomusers key = {c.nickname} user = {c} isadmin ={"true"} />)}

        </div>
  </div>
  </div>
  </div>

            </>
           )} 

      <div className='History-Box'> 
     
      {messages.map(c => < MessageList  key = {c.senderId} user ={c} />)}
 
     <br></br>
            
      </div>
      {props.room.is_dm  ? (
        <>

        </>
        ) : (
          <>
             <button type="button" onClick={HandleLeaveRoom} style={{bottom:0}}>
                    <span className="icon material-symbols-outlined">
     {"logout"} 
      </span>
      <span> Leave Room</span>
                  </button>
          </>)}
          
   {showInput ? (
    <>
     <form className='ChatRoom-Input-form' onSubmit={HandleInputMsg}>
    <div className='ChatRoom-InputBox'>
      <input type="text"
       className={`${inputMsg ? "has-value" : ""}`}
       id="textbox"
       placeholder='enter a message'
       onChange={event => SetInputMsg(event.target.value)}
       value={inputMsg || ""}
       /> 
      <label htmlFor="textbox"> 
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
       </label>
</div>
      
       <button
      onClick={SendMessage}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : "Send"}
      </span>
    </button>
    {errorMessage && <div className="error"> {errorMessage} </div>}

  </form>
    </>
   ) : (
    <>
     <button type="button" className='button-displayuser' >
              <span className="icon material-symbols-outlined">
                {"sentiment_very_dissatisfied"}
              </span>
              <span>     {errorMessage && <div className="error"> {errorMessage} </div>}
  </span>
            </button>

    </>
   )}
 
  </div>
  </div>
        </>
   
    
  </div>
  )
};
export default ChatRoomBox;
