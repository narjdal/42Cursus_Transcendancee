import React, {useState} from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import {useEffect} from "react";
import './Navbar.css'
import person from "./users/users.json"
import ContactList from './Friendlist/ContactList';
import axios from 'axios';
import Cookies from 'js-cookie';

// TODO :
// Request to Backend pour avoir la FriendList 
// Add Post request to Backend pour Ajouter un ami / Bloquer un ami 

function Navbar() {
    const [click,setClick]= useState(false);
  const [isShown,setIsShown] = useState(false);
  const[user42,setUser42] = useState <any >([]);
  const[friends,setFriends] = useState <any >([]);

    const [button, setButton] = useState(true);
    const [authenticated, setauthenticated] = useState("");
    const [sideBar,setSideBar] = useState(true);
    const [blur,SetBlur] = useState(false);
    const toggleSidebar = (e) => {
        document.body.classList.toggle("open");
        setSideBar(!sideBar);
        SetBlur(!blur);
    }
    const loggedInUser = localStorage.getItem("authenticated");
    const navigate = useNavigate();
    const navigateHome = () => {
        // 👇️ navigate to /contacts
        console.log("NAVIGATE TO HOME ");
        navigate('/');
      };
      const navigateAccount = () => {
        // 👇️ navigate to /contacts
        navigate('/Account');
      };
      const navigateChatRooms = () => {
        // 👇️ navigate to /contacts
        navigate('/Landing');
      };
      const navigateLeaderBoard = () => {
        // 👇️ navigate to /contacts
        navigate('/LeaderBoard');
      };
      const navigatePlay = () => {
        // 👇️ navigate to /contacts
        navigate('/Pong');
      };
      const handleFriendClick = event => {
        // Toggle Shown state
        setIsShown(current => !current);
  
         };
         //DOuble LogOut Component To Fixe 
      const LogUserOut = () => {
        console.log("Inside LogUser Out =>>> ")
        const loggedInUser = localStorage.getItem("authenticated");
        console.log("Before  : " + loggedInUser);
        if (loggedInUser == "true")
        {   
            localStorage.setItem("authenticated", "false");
            localStorage.setItem("user","");
            setauthenticated("false");

        const loggeduser = localStorage.getItem("user");
        if(loggeduser)
           var Current_User = JSON.parse(loggeduser);
            console.log("Logging out ..." + authenticated);
            if(Current_User)
          console.log("=>>>>> FROM THE NAVBAR  LOGOUT "   + Current_User.nickname + Current_User.UserId)

            // navigate("/");
          // Remove Cookie On Log Out 
           Cookies.remove('auth-cookie')

            window.location.reload();
        }
    };

    async function FetchUserInfo (id) {

      // ]
    const loggeduser = localStorage.getItem("user");
  
    if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
    const text = ("http://localhost:9000/GetUserPicture");
    console.log("Api get Link :  =>  " + text);
    
    const response = await axios.get("http://localhost:9000/GetUserPicture",{
    headers: {
      userId:id
    }
    }
    )
    const {nickname ,UserId,image_url,id42} = response.data;
    console.log("The Friends are " + JSON.stringify(response.data));
  //   response.data.forEach( result => {
      return response.data;
  }
  
    }
      useEffect(() => {
        const authenticated = localStorage.getItem("authenticated");
    const loggeduser = localStorage.getItem("user");
        // console.log("NavBar : Is User  auth ?  " + authenticated);
      
        if (authenticated == "true") {
          setauthenticated(authenticated);
        }
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          const {UserId} = Current_User
          console.log("Fetching Friends of this User " + UserId);
          setUser42(JSON.parse(localStorage.getItem("user")!))
      // FetchUserInfo(2)
      // .then((resp) => {
      //   console.log("resp => " + resp[0].id);
      //   setFriends(resp);
      //   console.log("user42.image_url" + user42.image_url)
      // })
          
          // var Current_User = JSON.parse(loggeduser!);
          // console.log("=>>>>> FROM THE NAVBAR " + loggeduser   + Current_User.nickname + Current_User.UserId)
          // setUser42(Current_User);
        }
      //  const {UserId,usual_full_name} = user42;

      },[ localStorage.getItem("user")]);
      const location = useLocation();
      // console.log("PATHNAME => " + location.pathname)
    return (
        <nav>
          <div>{(location.pathname === "/Pong" || location.pathname=== "/Account_infos")  ? (
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
                  <img src={user42.image_url}   className="avatar1" />            
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
                     {isShown && ( 
                        
                      //Show the friendlist only if button is pressed
                      // Here : Send an array.map of the Friendlist of the user 
                      // get request to backend , JSON object -> parse 
                      <div className='Contact'>
                        <span>
                        
                        <ContactList contacts={person} />
                        </span>
                      </div>
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