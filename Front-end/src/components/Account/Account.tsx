import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import ProfilePicUpload from '../Account/ProfilePicUpload';
import UpdateNickname from '../Account/UpdateNickname';
import './Account.css'
import Login from '../login/login';

const Account = () => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
    const [Updated, setisUpdated] = useState(false);
  const [authenticated, setauthenticated] = useState("");
	 const [user42,SetUser42] = useState <any>([]);
  const [showradiotwofa,Setradiotwofa] = useState(false);
  const [twoFa,setTwoFa] = useState(false);
  const [TwoFaDisable,setTwoFaDisable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 

  useEffect(() => {

    const authenticated = localStorage.getItem("authenticated");
  const loggeduser = localStorage.getItem("user");
    console.log("NavBar : Is User  auth ?  " + authenticated);
    if (authenticated === "true") {
      setauthenticated(authenticated);
    }
    if(loggeduser)
    {

      var Current_User = JSON.parse(loggeduser);
      console.log("=>>>>> FROM THE ACCOUNT " + loggeduser   + Current_User.nickname + Current_User.UserId)
      SetUser42(Current_User);

    }
    // console.log("I am navigating =>>> ");
    // navigate('/Account');
    //  const {UserId,usual_full_name} = user42;

    },[]);

  
  
    const HandeAchievements = (e) => {

      e.preventDefault();
      console.log("From Handle Achievements  ")
        navigate('/Achievements')
    };

    const HandleMatchHistory = (e) => {
    e.preventDefault();
    console.log("From Carreeeer ")
      navigate('/Carreer')
    }

     const handleFriendClick = (e) => {
      e.preventDefault()
      console.log("From Friend Click");
      navigate("/Social");
      
     }
     const HandleTwoFactor = () => {
      Setradiotwofa(!showradiotwofa);
      if(!showradiotwofa)
      {
        setErrorMessage("An Error occured");
      }
      // Here Request to GET Two FA if enable or not Ou je lai deja
    }
    const HandleTwoFa = () => {
      // Setradiotwofa(!showradiotwofa);
      // Here Request to GET Two FA if enable or not Ou je lai deja
      setTwoFa(!twoFa);
      setTwoFaDisable(false);
    }

    const DisableTwoFa = () => {
      // Setradiotwofa(!showradiotwofa);
      // Here Request to GET Two FA if enable or not Ou je lai deja
      setTwoFaDisable(!TwoFaDisable);
      setTwoFa(false);
    }

    const SendTwoFa = (e) => {
      e.preventDefault();
      // Setradiotwofa(!showradiotwofa);
      // Here Post Request  Of Two FA 
      //if enable or not Ou je lai deja
      if(twoFa)
      {
        setIsUpdating(true);

        setTimeout(() => {
          setIsUpdating(false);
          setisUpdated(true);
          setTimeout(() => setisUpdated(false), 2500);
        }, 2000);
        console.log("POSITIF CHEF")
      }
      else
      {
        setIsUpdating(true);

        setTimeout(() => {
          setIsUpdating(false);
          setisUpdated(true);
          setTimeout(() => setisUpdated(false), 2500);
        }, 2000);
        console.log("NEGATIF CHEF")
      }
    // if(twoFa)
    // {
    //   console.log("Enabling two fa in your account ....");
    // }
    // else
    // {
    //   console.log("Disabling two fa in your account ...")
    // }
    }

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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      {authenticated === "true" ? (
<>
<div className='body'>
      <div className='login-card'>
		  <img className="avatar" src={user42.image_url} alt="avatar" />
      <span> Welcome to your Dashboard  {user42.nickname} !  </span>
      <button type="button" className='has-border' onClick={HandleTwoFactor}>  
      <span className="icon material-symbols-outlined">
     {"Lock"}  2FA      </span> 
      </button>
      {showradiotwofa ? (
          <>

		<form className='AccountTwoFa-form'>
        <input type="radio"
        value ="Enable"
       placeholder="Room Name " 
       checked = {twoFa}
       onChange={HandleTwoFa}
       />
       Enable
       <input type="radio"
        value ="Disable"
       placeholder="Room Name " 
       checked = {TwoFaDisable}
       onChange={DisableTwoFa}
       />
       Disable

       <button
			   type="submit"
      onClick={SendTwoFa}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "Priority" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : " Todo Backend ..."}
      </span>
    </button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
        </form>
          </>
      ) : (
          <>
          </>
        )}
        <div className='AccountButtons'>
      <button type="button" className='' onClick={handleFriendClick}>  
         <span className="icon material-symbols-outlined">
     {"People"}  Social
      </span>
      </button>
      <button type="button" className='' onClick={HandleMatchHistory}>  
      <span className="icon material-symbols-outlined">
     {"History"}   Carreer
      </span> 
      </button>
      <button type="button" className='has-border' onClick={HandeAchievements}>  
      <span className="icon material-symbols-outlined">
     {"military_tech"}  Achievements
      </span> 
      </button>
      </div>
        <UpdateNickname
        />
      <ProfilePicUpload
      ProfileInfo={{name:user42.nickname,ProfilePic:user42.image_url}}/>
          </div>
          </div>
</>
      ):
      (
<>

<Login/>
 </>
      )}
 
      </div>
    );
    }
  };
  
export default Account;
