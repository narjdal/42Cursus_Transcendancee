import React, {useState} from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import {useEffect} from "react";
import './Navbar.css'
import person from "./users/users.json"
import ContactList from './Friendlist/ContactList';
import axios from 'axios';
import Cookies from 'js-cookie';
import { IsAuthOk } from '../utils/utils';
import { io } from 'socket.io-client';
import Notifs from './Notifs';

var gamesocket:any;
let id = 0;

// TODO :
// Request to Backend pour avoir la FriendList 
// Add Post request to Backend pour Ajouter un ami / Bloquer un ami 

function Navbar() {
    const [click,setClick]= useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notifMessage, setNotifsMessage] = useState("");

  const [isShown,setIsShown] = useState(false);
  const [allgood,setAllgood] = useState(false);
  const [OpenNotifs,setOpenNotifs] = useState(false);


  const[user42,setUser42] = useState <any >([]);
  const[friends,setFriends] = useState <any >([]);
  const[notifs,setNotifs] = useState(false);
    const [button, setButton] = useState(true);
    const [authenticated, setauthenticated] = useState("");
    const [sideBar,setSideBar] = useState(true);
    const [blur,SetBlur] = useState(false);
    const [invites,setInvites] = useState<any>([]);

    const toggleSidebar = (e) => {
      e.preventDefault();
        document.body.classList.toggle("open");
        setSideBar(!sideBar);
        SetBlur(!blur);
    }
    const loggedInUser = localStorage.getItem("authenticated");
    const navigate = useNavigate();

    const navigateHome = () => {
        // navigate('/Home');
        window.location.href = "http://localhost:3000/Home"

      };
      const navigateAccount = () => {
        // navigate('/');
        window.location.href = "http://localhost:3000/"

      };

      const navigateChatRooms = () => {
        // navigate('/Landing');
        window.location.href = "http://localhost:3000/Landing"

      };

      const navigateLeaderBoard = () => {
        // navigate('/LeaderBoard');
        window.location.href = "http://localhost:3000/LeaderBoard"

      };

      const navigateGameLanding = () => {
        window.location.href = "http://localhost:3000/GameLanding"

        // navigate('/GameLanding');
      };

      const navigatePlay = () => {
        window.location.href = "http://localhost:3000/Pong"

        // navigate('/Pong');
      };

      const handleFriendClick = event => {
        // Toggle Shown state
        event.preventDefault();
        setIsShown(current => !current);
       FetchUserInfo();
         };


 async function LogOut ()
         {
          const tt = localStorage.getItem("user")
          const loggedUser =JSON.parse(tt!);
          // console.log(" Login Out this user   => "  + loggedUser.nickname);


let endpoint = 'http://localhost:5000/auth/logout';
// endpoint = endpoint + userQuery;
console.log(" LogOut endpoint   " + endpoint)


await fetch((endpoint),{
    mode:'no-cors',
    method:'get',
    credentials:"include"
})


.then((response) => {
  localStorage.setItem("authenticated", "false");
  localStorage.setItem("online", "");
  localStorage.setItem("action","");

    localStorage.setItem("user","");
    window.location.reload();
})

.catch((error) => {
  console.log("An error occured : " + error)
  setErrorMessage("An error occured! User not found ! ");
  return error;
})
}

      const LogUserOut = (e) => {
        e.preventDefault();
        LogOut();
    };


    async function FetchUserInfo () {

    const loggeduser = localStorage.getItem("user");
  
    if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
    const text = ("http://localhost:5000/player/listOfFriends");
    // console.log("Social Fetch  Link :  =>  " + text);
    

    await fetch(text,{
      // mode:'no-cors',
      method:'get',
      credentials:"include"
  })
  
  .then((response) => response.json())
  .then(json => {
      // console.log("The response is => " + JSON.stringify(json))
       if ( IsAuthOk(json.statusCode) == 1)
       {
       window.location.reload();
       }
       
          setFriends(json);
       setAllgood(true);
      return json;  
  })
  .catch((error) => {
      console.log("An error occured : " + error)
      return error;
  })

    }
  }
  
  const HandleClickNotifs = (e) => {
    e.preventDefault();
    if(notifs)
    {
    setOpenNotifs(!OpenNotifs);
    setNotifsMessage("")
    }
    else
    {
      console.log("No notifs !")
      setNotifsMessage("You have no Invitation ! ")
    }
  }
  useEffect(() => {
    gamesocket = io("http://localhost:5000/game")
    // {:"name=my_img_name"})


    // console.log("Hadik hya:",localStorage.getItem("user"));

    gamesocket.emit("OnlineGameUsersBack",{
      user:localStorage.getItem("user")
    })

    
    gamesocket.on("UsersInGame", (data: any) => {

      console.log(" Users currently in game  ! : ", data);
      localStorage.setItem("InGame",JSON.stringify(data))

      // localStorage.setItem("InviteGame",data.Sendernickname);
      // setInvites(data);

      // invites.push(data.Sendernickname);
      // setInvites(data.Sendernickname)
      // localStorage.setItem("online",JSON.stringify(data))
    });
    
    gamesocket.on("ReceivedInvite", (data: any) => {
      console.log(" You Have Been Invited to play a game ! : ", data);
      // localStorage.setItem("InviteGame",data.Sendernickname);
      // setInvites(data);
      const obj = {
        id: id++,
        data

      }
    setInvites((prevData: any) => [...prevData, obj]);
    
      setNotifs(true);
      // invites.push(data.Sendernickname);
      // setInvites(data.Sendernickname)
      // localStorage.setItem("online",JSON.stringify(data))
    });

           // onlineUsersFront
            

  },[])

      useEffect(() => {
        const authenticated = localStorage.getItem("authenticated");
    const loggeduser = localStorage.getItem("user");
      
        if (authenticated == "true") {
          setauthenticated(authenticated);
        }
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          const {id} = Current_User
          setUser42(JSON.parse(localStorage.getItem("user")!))
        }
        else
        {
          localStorage.setItem("authenticated","false");
          window.location.reload();
        }

      },[ localStorage.getItem("user"),isShown]);
      const location = useLocation();
    return (
        <nav>
          <div>{( location.pathname=== "/Account_infos")  ? (
           <div>
            </div> 
          ):(
            <div>  {loggedInUser == "true" ? (
              <div>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
                 <div className="body">
            <nav className="sidebar">
              <div className="sidebar-inner">
                <header className="sidebar-header">
                  <button
                    type="button"
                    className="sidebar-burger"
                    onClick={toggleSidebar}
                  ></button>
                  
                  <img src={user42.avatar}   className="avatarsidebar" />            
               <span> {user42.nickname}</span> 
                </header>
                <nav className="sidebar-menu">
                  
                  <button type="button" onClick={navigateHome} className="has-border" >
                    <span className="icon material-symbols-outlined">
                Home 
      </span>
     <span> Home</span>
                  </button>
                  <button type="button" onClick={navigateAccount} className="has-border">
                    <span className="icon material-symbols-outlined">
     {"manage_accounts"} 
      </span>
      <span>Account</span>
                  </button>
                  <button type="button" onClick={navigatePlay}>
                <span className="icon material-symbols-outlined">
     {"videogame_asset"} 
      </span>
      <span>Play</span>
                  </button>

                  <button type="button" onClick={navigateGameLanding}>
                    <span className="icon material-symbols-outlined">
     {"live_tv"}  
      </span>
      <span>Live Games</span>
                  </button>
        
                  <button type="button" onClick={navigateLeaderBoard} className="has-border">
                    <span className="icon material-symbols-outlined">
     {"LeaderBoard"} 
      </span>
     <span>LeaderBoard</span> 
                  </button>
              
                  <button type="button" onClick={navigateChatRooms}>
                    <span className="icon material-symbols-outlined">
     {"Groups"}  
      </span>
      <span>Channels</span>
                  </button>


  
                      <button type="button" className='has-border' onClick={handleFriendClick}>
                    <span className="icon material-symbols-outlined">
     {"People"}  
      </span>
      <span>
      Social
      </span>
                      </button>
                      <link
      rel="stylesheet"
      href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
    />

    <button type="button" className='has-border' onClick={HandleClickNotifs}>
    <span>
 
    <i   className="uil uil-heart"  >

<div className={`${notifs  ? "em-notifs" : ""}`}>
      </div>
      </i>
       <span> 
       </span>
    </span>
  </button>

       {notifMessage && <div className="error"> {notifMessage} </div>}
       { OpenNotifs ? (
    <div className="Notif-Card">

  {invites.map(c => < Notifs  key = {c.id} notifs ={c} />)}

        {/* <Notifs notifs={invites}/> */}
    </div>

       ) : (
        <>
        </>
       )  }
         

                     {isShown && ( 
                        
                      //Show the friendlist only if button is pressed
                      // Here : Send an array.map of the Friendlist of the user 
                      // get request to backend , JSON object -> parse 
                      <>
                    {allgood ? (
                      <>
                        <div className='Contact'>
                        <span>
                        
                        <ContactList contacts={friends} />
                        </span>
                      </div>
                      </>
                    ) : (
                      <>
                      </>
                    )}
                    
                      </>
                     )}
                  <button type="button" onClick={LogUserOut} style={{bottom:0}}>
                    <span className="icon material-symbols-outlined">
     {"logout"} 
      </span>
      <span> Log out</span>
                  </button>
                </nav>
              </div>
            </nav>
            </div>
             </div>
              ) : (
              <div>
                </div>
              )}</div>
               
          )}</div>
 
    
    </nav>
    
    
    )
}

export default Navbar