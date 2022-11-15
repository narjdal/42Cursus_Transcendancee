import React from 'react';
import person from '../users/users.json'
import { Link, useParams } from 'react-router-dom';
import { useState } from "react";
import './Friendprofile.css'

const Friendprofile = () => {
  const params = useParams();
  //
  const [userState,setUserState] = useState<any>([]);
  //We send the Id as the params of the Link , 
  //ICi request Au Backend Avec l'ID de l'user demander stocker les infos dans const user 
  const user = person.find((x) => x._id === params.id);

  if (!user) {
      // TODO: 404
      console.log("ERROR ·404  from Friend Profile ,User Not found" + params.id  + params.name);
 return (
  <>
  </>
 )
    }
    else
  {
    console.log("B4" + user['name'] + params.name);
  return (
    <div className='FriendProfile'>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <img src={user.ProfilePic} height="80"/>
  <h2>{user.name}</h2>
    <h3>TotalGames: </h3>
    <h2>{user.TotalGames}</h2>
   <h3>Winrate</h3> 
    <h2>{user.winrate}</h2>
   <h3>Victories</h3> 
    <h2>{user.Victories}</h2>
  <h2><button className='FriendProfileButtons'>Remove Friend (TODO)</button></h2>
  <h3><button  className='FriendProfileButtons'>Match History :  (TODO)</button></h3>
    </div>
  );
  }
}
  
export default Friendprofile;