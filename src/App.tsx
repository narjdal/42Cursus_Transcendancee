import './App.css';
import Navbar from './components/NavBar';
import TempoNavbar from './components/TempoNav/NavbarGame';

import Footer from './components/Footer'
import React from 'react';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './components/pages/HomePage';
import Pong from './components/pages/Pong';
import LeaderBoard from './components/pages/LeaderBoard';
import Account from './components/pages/Account';
import AboutUs from './components/pages/AboutUs';
import HowToPlay from './components/pages/HowToPlay';
import { Landing } from './components/Chatrooms/Landing';
import { ChatRoom } from './components/Chatrooms/ChatRoom';
import  Friendprofile  from './components/Friendlist/Friendprofile';
import Pseudo from './components/login/Account_infos';
import  CreateRoom  from './components/Chatrooms/CreateRoom';
import './AppStyle.css'


function App() {
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
      </Routes>
      </Router>
    </div>
  );
}

export default App;
