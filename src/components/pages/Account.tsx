import React from 'react';
import { useEffect, useState } from "react";
import {Routes, Route, useNavigate} from 'react-router-dom';
import person from "../users/users.json"
import ProfilePicUpload from '../Account/ProfilePicUpload';
  
const Account = () => {
  const navigate = useNavigate();
  const [authenticated, setauthenticated] = useState("");
  const [loggeduser, setuser] = useState(null);
	 const [user42,SetUser42] = useState <any>([]);

  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    const loggeduser = localStorage.getItem("user");
    // console.log("User is " + authenticated);
  
    if (authenticated) {
      setauthenticated(authenticated);
    }
    if(loggeduser)
    {
      var Current_User = JSON.parse(loggeduser);
		// console.log("=>>>>> FROM Account  "   + Current_User.usual_full_name + Current_User.UserId + Current_User.image_url)
		SetUser42(Current_User);
    }
  }, []);
    if (authenticated === "false")
    {
      return (
      <div>
          <p>
            Not logged in 
          </p>
      </div>
      );
    }
    //ProfilePicUpload : Send User infos here  Get from state ?
    else
    {
    return (
      <div>
      <ProfilePicUpload
      ProfileInfo={{name:user42.nickname,ProfilePic:user42.image_url}}/>
        
      </div>
    );
    }
  };
  
export default Account;
