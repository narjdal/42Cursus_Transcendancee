import React from "react";
import {Link, Navigate, useNavigate} from'react-router-dom';
import { useState ,useEffect} from "react";

import './DisplayUserHome.css'


const DisplayUserHome = (props) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [currentUser,setCurrentUser] = useState<any>([]);

useEffect(() => {
   const user =  localStorage.getItem("user");
   if(user)
   {
   const current = JSON.parse(user);
   setCurrentUser(current);

   }

},[])
const Reload = (e) => {
    e.preventDefault();
        window.location.href= ('/users/' + props.usertoshow.nickname)
}
    return (
        <>
        {errorMessage && <div className="error"> {errorMessage} </div>}

        <div className="display-user-container"> 
<ul>
   <li>
   <img src={props.usertoshow.avatar} 
   className="avataruser"
     />
     </li>
     <li>
    <Link style={{color:'white'}} to={`/users/${props.usertoshow.nickname}`} >
   <p>   <button onClick={Reload}>  {props.usertoshow.nickname}  </button>  </p>
    </Link>
    </li>

      </ul>
      </div>
        </>
    )
}
export default DisplayUserHome;