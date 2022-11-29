import React, { useEffect } from 'react';
import person from '../users/users.json'
import { Link, useParams } from 'react-router-dom';
import { useState } from "react";
import './Friendprofile.css'
import { Location } from 'react-router-dom';
import { IsAuthOk } from '../../utils/utils';

const Friendprofile = () => {
  const params = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [userState, setUserState] = useState<any>([]);
  const [relation, setRelation] = useState("");
  const [icons, setIcons] = useState("");
  const [msg, setMsg] = useState("");
  const [action, setAction] = useState("");
  const [choice, setChoice] = useState("");
  localStorage.setItem("choice", "");
  localStorage.setItem("action2", "");
  //We send the Id as the params of the Link , 
  //ICi request Au Backend Avec l'ID de l'user demander stocker les infos dans const user 

  async function AcceptRelationship() {

    let endpoint = "http://localhost:5000/player/acceptFriendship/"

    console.log("AcceptRelationship  => " + endpoint + " \n user:" + params.nickname)
    //  setAction("");
    endpoint = endpoint + params.nickname;
    await fetch((endpoint
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })


      .then((response) => response.json())
      .then(json => {
        console.log("The response  => " + JSON.stringify(json))
          IsAuthOk(json)
          window.location.reload();
        setErrorMessage("");
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        setErrorMessage("An error occured! Can't Accept Relationship    ! ");
        return error;
      })

  }




  async function RefuseRelationship() {


    let endpoint = "http://localhost:5000/player/refuseFriendship/"

    console.log("RefuseRelationship  => " + endpoint + " \n user" + params.nickname)
    //  setAction("");
    endpoint = endpoint + params.nickname;
    await fetch((endpoint
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })


      .then((response) => response.json())
      .then(json => {
        console.log("The response is => " + JSON.stringify(json))
        // if (json.ok)
        IsAuthOk(json);
          window.location.reload();
        setErrorMessage("");
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        setErrorMessage("An error occured! Can't Refuse Relationship    ! ");
        return error;
      })

  }

  async function ExecuteRelationship() {
    let endpoint;
    let execute = localStorage.getItem("action2");
    console.log("Execute final " + action);
    switch (action) {
      case "addFriend":
        {
          endpoint = "http://localhost:5000/player/requestFriendship/"
          break;
        }
      case "blockFriend":
        {
          endpoint = "http://localhost:5000/player/blockFriendship/"
          break;

        }
      case "Accept":
        {
          endpoint = "http://localhost:5000/player/acceptFriendship/"
          break;

        }
      case "Refuse":
        {
          endpoint = "http://localhost:5000/player/refuseFriendship/"
          break;

        }
      case "unblockFriend":
        {
          endpoint = "http://localhost:5000/player/unblockFriendship/";
          break;
        }

    }
    console.log("ExecuteRelationship  => " + endpoint + " \n action" + execute)
    //  setAction("");
    endpoint = endpoint + params.nickname;
    await fetch((endpoint
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })


      .then((response) => response.json())
      .then(json => {
        console.log("The response is => " + JSON.stringify(json))
        IsAuthOk(json);
        // if (json.ok)
        window.location.reload();
        setErrorMessage("");
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        setErrorMessage("An error occured! Can't update Relationship    ! ");
        return error;
      })

  }


  async function FetchRelationship() {

    const loggeduser = localStorage.getItem("user");
    if (loggeduser) {
      const current = JSON.parse(loggeduser);
      console.log("Fetching Relationship    Infos   => " + params.nickname + " I am : " + current.nickname);

      let endpoint = 'http://localhost:5000/player/statusFriendship/'
      let nicknametofetch: string = JSON.stringify(params.nickname);
      console.log(" this endpoint   " + endpoint + " Fetching : " + nicknametofetch)
      http://localhost:5000/statusFriendship/?id=narjdal

      await fetch((`http://localhost:5000/player/statusFriendship/${params.nickname}`
      ), {
        // mode:'no-cors',
        method: 'get',
        credentials: "include"
      })



        .then((response) => response.json())
        .then(json => {
          console.log("The response is => " + JSON.stringify(json))
          setErrorMessage("");
          // localStorage.setItem("usertoshow",JSON.stringify(json));
          localStorage.setItem("choice", json);
          // setRelation(json);
          // setChoice(json);
          return json;
          // setRelation("AcceptOrRefuse");
          //  if(json)
          //  {
          //  console.log("The Relationship is => " + json)
          //   setRelation(JSON.stringify(json));
          //   setChoice(json);
          //   setRelation(json);
          //  }

          //     if (resp === "AddFriend")
          //     {
          //       console.log("GGS");
          //     }
          //     switch(JSON.stringify(json))
          //  {
          //   case "AddFriend":
          //    {
          //     console.log("ww khello")
          //     setIcons("people")
          //    setMsg("AddFriend");
          //    setAction("Add");
          //    setRelation("addFriend");
          //    break;
          //    }  

          //   case "blockFriend":

          //   {  
          //     setIcons("block")
          //    setMsg("block");
          //    setAction("block")
          //      setRelation("blockFriend");
          //    break;

          //   }

          //      case"unblockFriend":

          //     {
          //    setMsg("unblock");
          //       setAction("unblock")
          //     setIcons("unblock")

          //        setRelation("unblockFriend");
          //    break;

          //     }
          //     case "pendingFriend":
          //      { 
          //     setIcons("people")
          //     setMsg("pending ...")
          //     setAction("pending")
          //      setRelation("pendingFriend")
          //    break;

          //     }
          //     case"acceptFriend":
          //     {
          //   //  setMsg("Accept");
          //     // setIcons("people")
          //     // setAction("");
          //        setRelation("AcceptOrRefuse");
          //    break;

          //     }
          //   default:

          //    {
          //     console.log("ERROR DEFAULT" + json) 
          //     setRelation("error");
          //    break;
          //   }
          //    }
        })
        .catch((error) => {
          console.log("An error occured : " + error)
          // setRelation("error");
          setErrorMessage("An error occured! Relationship not found ! ");
          return error;
        })

    }

  }
  async function FetchUserInfos() {
    console.log("Fetching User Profile  Infos  Home Page  => " + params.nickname);


    const loggeduser = localStorage.getItem("user");
    if (loggeduser) {
      let endpoint = 'http://localhost:5000/player/profile/?id=';
      console.log(" this endpoint   " + endpoint)
      await fetch((`http://localhost:5000/player/profile/${params.nickname}`), {
        // mode:'no-cors',
        method: 'get',
        credentials: "include"
      })


        .then((response) => response.json())
        .then(json => {
          // console.log("The response is => " + JSON.stringify(json))
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

  async function SetRelationInfos() {


    await FetchRelationship()
      .then(() => {
        // console.log("relation is " + relation + "choice is "  + choice);
        // if(choice === "AddFriend")
        // {
        //   console.log("ww khello")
        //       setIcons("people")
        //      setMsg("AddFriend");
        //      setAction("Add");
        //      setRelation("addFriend");
        // }

      })
    const tt = localStorage.getItem("choice");
    console.log("TT is " + tt + " the action is " + action);
    if (tt === "addFriend") {
      // console.log("ww khello")
      setIcons("people")
      setMsg("AddFriend");
      setAction("addFriend");
      setRelation("addFriend");
      //  ExecuteRelationship("AddFriend");
      localStorage.setItem("action", "addFriend");

    }
    if (tt === "blockFriend") {
      // setAction("none");
      // setRelation("Blocked");
      // localStorage.setItem("action","none");
      setIcons("block")
      setMsg("Block friend ");
      setAction("blockFriend")
      setRelation("blockFriend");
      localStorage.setItem("action", "blockFriend");

      //  ExecuteRelationship("BlockFriend");
    }
    if (tt === "unblockFriend") {
      setMsg("Unblock this user.");
      setAction("unblockFriend")
      setIcons("block")
      setRelation("unblockFriend");
      localStorage.setItem("action", "unblockFriend");

      //  ExecuteRelationship("Unblock");

    }
    if (tt === "pendingFriend") {
      setMsg("Waiting for the user to accept ...");
      setAction("pending")
      setIcons("hourglass_top")
      setRelation("pending");
      localStorage.setItem("action", "pending");

    }
    if (tt === "acceptFriend" || tt === "refuseFriend") {
      setRelation("AcceptOrRefuse");
    }
    if (tt === "YourBlocked") {
      setAction("none");
      setRelation("YourBlocked");
      localStorage.setItem("action", "none");
    }
    else {
      const arr = (localStorage.getItem("choice")!)

      if (arr.includes("acceptFriend") || arr.includes("refuseFriend")) {
        setRelation("AcceptOrRefuse");
      }
      // setMsg("An error o");
      // setAction("noaction");
      // setRelation("error");
      // localStorage.setItem("action","noaction");

    }
    // if(localStorage.getItem("choice"))
  };
  useEffect(() => {
    FetchUserInfos();

    SetRelationInfos();
    // FetchUserInfos();

    // ExecuteRelationship();
  }, [])


  const HandleAction = (e) => {
    e.preventDefault();

    // const execute = localStorage.getItem("action")
    console.log("Executing this command =>   " + action);
    if (action !== "error")
      ExecuteRelationship();
    else
      console.log("Error ! can't execute action.");

  }

  const HandleRefuseFriendRequest = (e) => {
    e.preventDefault();
    setAction("Refuse");
    // localStorage.setItem("action","Refuse");
    // ExecuteRelationship();
    RefuseRelationship();
  }

  const HandleAcceptFriendRequest = (e) => {
    e.preventDefault();
    console.log("Accepting the request ...");
    setAction("Accept")
    AcceptRelationship();

  }
  const HandleInviteToGame = (e) => {
    e.preventDefault();
    console.log("invinting to play a game ...")
  }
  if (!userState) {
    // TODO: 404
    console.log("ERROR ·404  from Friend Profile ,User Not found" + params.id + params.name);
    return (
      <>
      </>
    )
  }
  else {
    // console.log("B4" + userState['nickname'] + params.nickname);
    return (
      <div className='FriendProfile'>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        {errorMessage && <div className="error"> {errorMessage} </div>}
        {relation === "YourBlocked" ? (
          <>
          </>
        ) : (
          <>
       <img src={userState.avatar} height="80" />
        <h2>{userState.nickname}</h2>
        <h3>TotalGames: </h3>
        <h2>{userState.wins}</h2>
        <h3>Win:</h3>
        <h2>{userState.wins}</h2>
        <h3>Lose</h3>
        <h2>{userState.loses}</h2>
          </>
        )}
       


        <br />
        {relation === "YourBlocked" ? (
          <>
            <button type="button" className='button-displayuser' >
              <span className="icon material-symbols-outlined">
                {"sentiment_very_dissatisfied"}
              </span>
              <span> You are blocked !    </span>
            </button>
          </>
        ) : (
          <>
            {relation === "AcceptOrRefuse" ? (
              <>
                <button type="button" className='' >
                  <span className="icon material-symbols-outlined">
                    {"History"}
                  </span>
                  <Link style={{ color: 'blue' }} to={`/Carreer/${userState.nickname}`} >
                    <span>  {userState.nickname} Carreer </span>
                  </Link>
                </button>
                <br />
                <h2>{userState.nickname} want to be your friend ! </h2>
                <button type="button" className='button-displayuser' onClick={HandleAcceptFriendRequest}>
                  <span className="icon material-symbols-outlined">
                    {"Favorite"}
                  </span>
                  <span>Accept</span>
                </button>
                <button type="button" className='button-displayuser' onClick={HandleRefuseFriendRequest}>
                  <span className="icon material-symbols-outlined">
                    {"Cancel"}
                  </span>
                  <span>Refuse</span>
                </button>
              </>
            ) : (
              <>

                {action ? (
                  <>
                    <button type="button" className='' >
                      <span className="icon material-symbols-outlined">
                        {"History"}
                      </span>
                      <Link style={{ color: 'blue' }} to={`/Carreer/${userState.nickname}`} >
                        <span>  {userState.nickname} Carreer </span>
                      </Link>
                    </button>

                  </>
                ) : (
                  <>
                  </>
                )}
                <br />
                <button type="button" className='button-displayuser' onClick={HandleAction}>
                  <span className="icon material-symbols-outlined">
                    {icons}
                  </span>
                  <span>{msg}</span>
                </button>
                <br/>

                     <button type="button" id="ss" className='ButtonSocial-Unfriend' onClick={HandleInviteToGame}>
    <span className="icon material-symbols-outlined">
     {"stadia_controller"}  
      </span>
      <span> Play  </span>
      </button>
              </>

            )}

          </>
        )}

      </div>
    );
  }
}

export default Friendprofile;