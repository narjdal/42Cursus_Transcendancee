import React, { useEffect } from 'react';
import person from '../users/users.json'
import { Link, useParams } from 'react-router-dom';
import { useState } from "react";
import './Friendprofile.css'

const Friendprofile = () => {
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [userState,setUserState] = useState<any>([]);
  const [relation,setRelation] = useState("");
  const [icons,setIcons] = useState("");
  const [msg,setMsg] = useState("");
  const [action,setAction] = useState("");
  //We send the Id as the params of the Link , 
  //ICi request Au Backend Avec l'ID de l'user demander stocker les infos dans const user 

async function ExecuteRelationship () 
{

}


  async function FetchRelationship()
  {
    
        const loggeduser = localStorage.getItem("user");
    if(loggeduser)
    {
      const current = JSON.parse(loggeduser);
    console.log("Fetching Relationship    Infos   => " + params.nickname + " I am : " + current.nickname);

    let endpoint = 'http://localhost:5000/player/statusFriendship/'
    let nicknametofetch :string=  JSON.stringify(params.nickname);
    console.log(" this endpoint   " + endpoint + " Fetching : " + nicknametofetch)
    http://localhost:5000/statusFriendship/?id=narjdal
    
  await fetch((`http://localhost:5000/player/statusFriendship/${params.nickname}`
    ),{
        // mode:'no-cors',
        method:'get',
        credentials:"include"
    })
    

       // await fetch((endpoint + new URLSearchParams({
    //   login:nicknametofetch
    // }))

    
    
    .then((response) => response.json())
    .then(json => {
        console.log("The response is => " + JSON.stringify(json))
      setIcons("sentiment_very_dissatisfied")
     setMsg("error");
     setAction("error")
     

      switch(json.choices)
   {
    case "addFriend":
     {
      console.log("ww khello")
      setIcons("people")
     setMsg("AddFriend");
     setAction("Add");
      return setRelation("addFriend");
     }  

    case "blockFriend":
      
    {  
      setIcons("block")
     setMsg("block");
     setAction("block")
      return setRelation("blockFriend");}
      case"unblockFriend":

      {
     setMsg("unblock");
        setAction("unblock")
      setIcons("unblock")

        return setRelation("unblockFriend");
      }
      case "pendingFriend":
       { 
      setIcons("people")
      setMsg("pending ...")
      setAction("pending")
      return setRelation("pendingFriend")
      }
      case"acceptFriend":
      {
     setMsg("Accept");
      setIcons("people")
      setAction("Accept");
        return setRelation("accept");
      }
    case "":
     { setRelation("error");}
     }
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
  async function FetchUserInfos ()  {
    console.log("Fetching User Profile  Infos  Home Page  => " + params.nickname);
    
    
        const loggeduser = localStorage.getItem("user");
    if(loggeduser)
    {
    let endpoint = 'http://localhost:5000/player/?id=';
    console.log(" this endpoint   " + endpoint)
    await fetch((`http://localhost:5000/player/${params.nickname}`),{
        // mode:'no-cors',
        method:'get',
        credentials:"include"
    })
    
    
    .then((response) => response.json())
    .then(json => {
        console.log("The response is => " + JSON.stringify(json))
      setErrorMessage(""); 
      // localStorage.setItem("usertoshow",JSON.stringify(json));
       
      setUserState(json);
        return json;
    })
    .catch((error) => {
      console.log("An error occured : " + error)
      setUserState([])
      // localStorage.setItem("usertoshow","");
      setErrorMessage("An error occured! User not found ! ");
      return error;
    })
    
    }

    };
    
  useEffect(() => {

    // FetchUserInfos();
    FetchUserInfos();
    FetchRelationship();
    console.log("relation is " + relation);
  },[])


  const HandleAction = (e) => {
    e.preventDefault();

    console.log("the action is " + action);
    if(action !== "error")
    ExecuteRelationship();
    else
    console.log("Error ! can't execute action.");
 
  }
  if (!userState) {
      // TODO: 404
      console.log("ERROR ·404  from Friend Profile ,User Not found" + params.id  + params.name);
 return (
  <>
  </>
 )
    }
    else
  {
    console.log("B4" + userState['nickname'] + params.nickname);
  return (
    <div className='FriendProfile'>
    {errorMessage && <div className="error"> {errorMessage} </div>}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <img src={userState.avatar} height="80"/>
  <h2>{userState.nickname}</h2>
    <h3>TotalGames: </h3>
    <h2>{userState.wins}</h2>
   <h3>Win:</h3> 
    <h2>{userState.wins}</h2>
   <h3>Lose</h3> 
    <h2>{userState.loses}</h2>
    
    {relation === "error" ? (
      <>
       <h2><button className='FriendProfileButtons'>Remove Friend (TODO)</button></h2>
  <h3><button  className='FriendProfileButtons'>Match History :  (TODO)</button></h3>
      </>
    ) : (
      <>
           <button type="button" className='button-displayuser' onClick={HandleAction}>  
         <span className="icon material-symbols-outlined">
     {icons}  
      </span>
      <span>{msg}</span>
      </button>
      </>
    )}
  
    </div>
  );
  }
}
  
export default Friendprofile;