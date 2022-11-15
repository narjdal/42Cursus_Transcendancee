import react from 'react'
import { useState } from 'react';
import './UpdateNickname.css'
import {Routes, Route, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const UpdateNickname = (props) => {

    const [nickName,setNickName] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [Updated, setisUpdated] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  async function UploadNickname (nickName)  {
    

    const loggedUser = localStorage.getItem("user");
    if(loggedUser)
    {

    var Current_User = JSON.parse(loggedUser);
    const post = {
      nickName:nickName,
      UserId:Current_User.UserId,
      image_url:Current_User.image_url
    }
    console.log("LoggedUser " + Current_User.UserId);
  const text = ("http://localhost:9000/update/nickname");
  console.log("Api Post Link :  =>  " + text);
  
  const response = await axios.post(text,post)
    
  // // 	onUploadProgress: progressEvent => {
  // // 		setLoaded(progressEvent.loaded / progressEvent.total!*100);
  // // 	},
  // // });
  // // 	}
    return response.data;
    }
  
  };
    const UpdateNickname = (e) => {
        e.preventDefault();
        console.log("Hello from update nickname")
       if(nickName)
       {
     
      setIsUpdating(true);

      UploadNickname(nickName)
      .then((resp) => {
				const test  = JSON.stringify(resp);

				console.log("The Resp Of Update Nickname is  => " + test);
				localStorage.setItem("user","");
        localStorage.setItem("user",test);
        let UpdatedUser = localStorage.getItem("user");
				console.log("Update Nick=>     " + JSON.stringify(UpdatedUser));
      	setTimeout(() => {
          setIsUpdating(false);
          setisUpdated(true);
          setTimeout(() => setisUpdated(false), 2500);
          window.location.reload();
       
        }, 2000);
      })
      
      
      }
      else
      {
        setErrorMessage("Please chose a valid nickname !")
      }
    };

    return (
        <>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <form className='UpdateNickname-form'>
       <br>
       </br>
       <div className='ProfilePic-textBox'>
        <input type="text"
       className={`${nickName ? "has-value" : ""}`}
	   id="textbox"
       onChange={event => setNickName(event.target.value)}
       value={nickName || ""}
       />
<label htmlFor='textbox'> Nickname</label>
</div>
         <button
      onClick={UpdateNickname}
      className={isUpdating || Updated ? "sending" : ""}
    >
      <span className="icon material-symbols-outlined">
        {Updated ? "check" : "send"}
      </span>
      <span className="text">
        {isUpdating ? "Updating ..." : Updated ? "Updated" : "Update Nickname"}
      </span>
    </button>
    {errorMessage && <div className="error"> {errorMessage} </div>}
       {/* <button type="submit" onClick={UpdateNickname}> Submit</button> */}
       </form>
        </>

    );

};

export default UpdateNickname;