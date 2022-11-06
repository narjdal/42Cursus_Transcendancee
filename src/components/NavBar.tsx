import React, {useState} from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import {useEffect} from "react";
import './Navbar.css'
import person from "./users/users.json"
import ContactList from './Friendlist/ContactList';

// TODO :
// Request to Backend pour avoir la FriendList 
// Add Post request to Backend pour Ajouter un ami / Bloquer un ami 

function Navbar() {
    const [click,setClick]= useState(false);
  const [isShown,setIsShown] = useState(false);
  const[user42,setUser42] = useState <any >([]);
    const [button, setButton] = useState(true);
    const [authenticated, setauthenticated] = useState("");
    const [sideBar,setSideBar] = useState(true);
    const toggleSidebar = (e) => {
        document.body.classList.toggle("open");
        setSideBar(!sideBar);
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

            navigate("/");
            window.location.reload();
        }
    };
      useEffect(() => {
        const authenticated = localStorage.getItem("authenticated");
    const loggeduser = localStorage.getItem("user");
        console.log("NavBar : Is User  auth ?  " + authenticated);
      
        if (authenticated == "true") {
          setauthenticated(authenticated);
        }
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          console.log("=>>>>> FROM THE NAVBAR " + loggeduser   + Current_User.nickname + Current_User.UserId)
          setUser42(Current_User);
        }
      //  const {UserId,usual_full_name} = user42;

      },[ localStorage.getItem("user")]);
      const location = useLocation();
      // console.log("PATHNAME => " + location.pathname)
    return (
        <nav>
          <div>{location.pathname === "/Pong"  ? (
           <div>
            </div> 
          ):(
            <div>  {loggedInUser == "true" ? (
              <div>
                 <div className="body">
            <nav className="sidebar">
              <div className="sidebar-inner">
                        <header className="sidebar-header">
                  <button
                    type="button"
                    className="sidebar-burger"
                    onClick={toggleSidebar}
                  ></button>
                  <img src={user42.image_url}   className="sidebar-logo" />
               <span> {user42.nickname}</span> 
                </header>
                <nav className="sidebar-menu">
                  <button type="button" onClick={navigateHome} >
                    <img src="/images/icon-home.svg" />
                    <span>Home</span>
                  </button>
                  <button type="button" onClick={navigateAccount} className="has-border">
                    <img src="./images/icon-accounts.svg" />
                    <span>Accounts</span>
                  </button>
                  <button type="button" onClick={navigatePlay}>
                    <img src="./images/cbf1ba6cba8053055f09d9b77fe2b884.jpeg" />
                    <span>Play</span>
                  </button>
        
                  <button type="button" onClick={navigateLeaderBoard} className="has-border">
                    <img src="./images/icon-acoustic.svg" />
                    <span>LeaderBoard</span>
                  </button>
              
                  <button type="button" onClick={navigateChatRooms}>
                    <img src="./images/icon-levels.svg" />
                    <span>ChatRooms</span>
                  </button>
  
                      <button type="button" className='has-border' onClick={handleFriendClick}><img src="/images/Chaticon.png" height="35"/>
                    <span> Social</span>
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
                  <button type="button" onClick={LogUserOut}>
                    <img src="./images/logout-icon-png-transparent-login-logout-icon-11562923416nzkie6fbka.png" />
                    <span>LogOut</span>
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