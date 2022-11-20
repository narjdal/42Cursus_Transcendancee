import './App.css';
import Navbar from './components/NavBar';
import TempoNavbar from './components/TempoNav/NavbarGame';
import Login from './components/login/login';
import Footer from './components/Footer'
import React from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './components/pages/HomePage';
import Pong from './components/pages/Pong';
import LeaderBoard from './components/pages/LeaderBoard';
import Account from './components/Account/Account';
import AboutUs from './components/pages/AboutUs';
import HowToPlay from './components/pages/HowToPlay';
import { Landing } from './components/Chatrooms/Landing';
import { ChatRoom } from './components/Chatrooms/ChatRoom';
import  Friendprofile  from './components/Friendlist/Friendprofile';
import Pseudo from './components/Account/Account_infos';
import  CreateRoom  from './components/Chatrooms/CreateRoom';
import Carreer from './components/Account/Account_pages/Carreer';
import Achievements from './components/Account/Account_pages/Achievements/Achievements'
import './AppStyle.css'
import Social from './components/Account/Account_pages/Social/Social'
import { getCookies } from './utils/utils';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode'

const App = () => {
  // const cookies = new Cookies();
  // const navigate = useNavigate();
  const test =  getCookies('user');

 const accessToken = Cookies.get('auth-cookie')
//  const tt = JSON.parse(accessToken);
// const user = tt.user;

// let accessToken;
  
 if(!accessToken)
 {
  console.log("NO ACCESS TOKEN PROVIDED SORRY");
  return (
    <>
    <Router>
      <Login/>
      
    </Router>
    </>
  )
 }
 else
 {
const user = jwt(accessToken)
// console.log(" ACCESS TOKEN =>   " + accessToken + "TEST =>   " + test);
console.log("USER JWT => " + JSON.stringify(user));

  localStorage.setItem("authenticated","true");
  localStorage.setItem("user",JSON.stringify(user));
  return (
    <div className="App">
      <Router>
      <Navbar/>
      <Routes>
      <Route path='/'  element={<Home />} />
      <Route path='/Pong' element={<Pong/>} />
      <Route path='/LeaderBoard' element={<LeaderBoard/>} />
      <Route path='/Account' element={<Account/>} />
      <Route path='/Account_infos' element={<Pseudo/>} />
      <Route path='/AboutUs' element={<AboutUs/>} />
      <Route path='/HowToPlay' element={<HowToPlay/>} />
      <Route path="/Landing" element={<Landing />} />
      <Route path="/room/:id" element={<ChatRoom />} />
      <Route path="/CreateRoom" element={<CreateRoom />} />
      <Route path="/users/:id" element={<Friendprofile />} />
      <Route path="/Carreer" element={<Carreer/>} />
      <Route path="/Achievements" element={<Achievements/>} />
      <Route path="/Social" element={<Social/>} />

    
      </Routes>
      </Router>
    </div>
  );
 }
}

export default App;
