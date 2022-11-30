import './App.css';
import Navbar from './components/NavBar';
import TempoNavbar from './components/TempoNav/NavbarGame';
import Login from './components/login/login';
import React, { useEffect } from 'react';
import { Notification } from 'react-notifications'
// import {addNotification} from 'react-notifications';
import { iNotification } from 'react-notifications-component'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/HomePage';
import Pong from './components/pages/Pong';
import LeaderBoard from './components/pages/LeaderBoard';
import Account from './components/Account/Account';
import AboutUs from './components/pages/AboutUs';
import HowToPlay from './components/pages/HowToPlay';
import { Landing } from './components/Chatrooms/Landing';
import { ChatRoom } from './components/Chatrooms/ChatRoom';
import Friendprofile from './components/Friendlist/Friendprofile';
import Pseudo from './components/Account/Account_infos';
import CreateRoom from './components/Chatrooms/CreateRoom';
import Carreer from './components/Account/Account_pages/Carreer';
import Achievements from './components/Account/Account_pages/Achievements/Achievements'
import './AppStyle.css'
import Social from './components/Account/Account_pages/Social/Social'
import { getCookies } from './utils/utils';
import Cookies from 'js-cookie';
import jwt from 'jwt-decode'
import { login } from './cookies/AuthProvider';
import getProfile from './utils/fetchProfile'
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

const App = () => {
  const accessToken = "ss";
  const [isLogged, setIslogged] = useState(false);
  const [trylogin, settrylogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true")
     {

      //config socket client on front end
 


      console.log("Loggin the user");
      setIslogged(true);
    }
    if (localStorage.getItem("trylogin") === "true") {
      HandleProfile();
      console.log("trylogin is  true");
    }
  }, [trylogin])
  async function HandleProfile() {

    console.log("INSIDE HANDLE PROFILE");
    await getProfile()
      .then((response) => {
        console.log("Handle Profile response is => " + response)
        settrylogin(!trylogin);
      })


  }

  if (!isLogged) {
    console.log("You are not logged in.");
    return (
      <>
        <Router>
          <button onClick={(e) => localStorage.setItem("trylogin", "true")}> <Login />
          </button>

        </Router>
      </>
    )
  }
  else {


    // const user = localStorage.getItem("user");
    // console.log(" User Object  =>   " + user)

    // const socket = io("http://localhost:5000");
    // console.log("socket is connecting ");


    
    // socket.on("dm", () => {
    //   console.log("connected");
    // });
    return (
      <div className="App">
        {/* <link rel="stylesheet" href="toruskit.blobz/blobz.min.css" />
      <div className="tk-blob">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 747.2 726.7">
    <path d="M539.8 137.6c98.3 69 183.5 124 203 198.4 19.3 74.4-27.1 168.2-93.8 245-66.8 76.8-153.8 136.6-254.2 144.9-100.6 8.2-214.7-35.1-292.7-122.5S-18.1 384.1 7.4 259.8C33 135.6 126.3 19 228.5 2.2c102.1-16.8 213.2 66.3 311.3 135.4z"></path>
  </svg>
</div>
<div className="tk-blob" >
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 451.6 385.5">
    <path d="M381.4 86.5c43.5 48 77.5 110.3 68.8 168.7-8.6 58.4-59.9 113-114.8 126.7-54.9 13.6-113.4-13.7-176.6-40.6-63.1-27-130.7-53.5-151.5-102.8-20.9-49.2 5.1-121.1 50.3-169.5C102.8 20.7 167.1-3.9 225.9.5c58.8 4.5 111.9 38.1 155.5 86z"></path>
  </svg>
</div> */}
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Account />} />
            <Route path='/Pong' element={<Pong />} />
            <Route path='/LeaderBoard' element={<LeaderBoard />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/Account_infos' element={<Pseudo />} />
            <Route path='/AboutUs' element={<AboutUs />} />
            <Route path='/HowToPlay' element={<HowToPlay />} />
            <Route path="/Landing" element={<Landing />} />
            <Route path="/room/:id" element={<ChatRoom />} />
            <Route path="/Carreer/:id" element={<Carreer />} />

            <Route path="/CreateRoom" element={<CreateRoom />} />
            <Route path="/users/:nickname" element={<Friendprofile />} />
            <Route path="/Achievements" element={<Achievements />} />
            <Route path="/Social" element={<Social />} />


          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
