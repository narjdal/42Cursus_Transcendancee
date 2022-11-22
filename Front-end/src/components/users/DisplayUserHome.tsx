import React from "react";
import {Link} from'react-router-dom';
import { useState ,useEffect} from "react";

import './DisplayUserHome.css'

const DisplayUserHome = (props) => {

    async function ExecuteFriendship (action:string) {

        console.log("Executing Friendship   Infos     => " + props.user.nickname + " is being " + action + "(you are sender)");


        // const auth =   await 
        const endpoint = 'http://localhost:5000/player/myprofile'
        console.log(" this endpoint " + endpoint)
        
        // await fetch(endpoint,{
        //     // mode:'no-cors',
        //     method:'get',
        //     credentials:"include"
        // })
        
        // .then((response) => response.json())
        // .then(json => {
        //     console.log("The response is => " + JSON.stringify(json))
        //   localStorage.setItem("authenticated","true");
        //   localStorage.setItem("user",JSON.stringify(json));
        //   localStorage.setItem("trylogin","false");
          
        //     return json;
        // })
        // .catch((error) => {
        //     console.log("An error occured : " + error)
        //     return error;
        // })
    }

    const HandleAddFriend = (e) => {
        e.preventDefault();
        console.log("Add this person ..." + props.user.nickname)
        ExecuteFriendship("Add");
    }
    const HandleBlockFriend = (e) => {
        e.preventDefault();
        console.log("Blocking this person ..." + props.user.nickname)
        ExecuteFriendship("block");
   
    }

    return (
        <>
        <div className="Contact-HELP"> 
    <table className="Contact-table">
        <tbody>
    <tr>
<th>
    <th>
        <th>
            Name
        </th>
    </th>
</th>
   </tr>
   <td> <img src={props.user.avatar} 
   className="avatar1"
     />
     </td>
     <td> 
    <Link style={{color:'white'}} to={`/users/${props.user.id}`} >
   <p> {props.user.nickname} </p>
    </Link>
    </td> 
    <div className="icon-off-div">
    <button type="button" className='has-border' onClick={HandleAddFriend}>
      <span className="icon material-symbols-outlined">
     {"person"}  
      </span> 
      <span> Add </span>
      </button>


      <button type="button" className='has-border' onClick={HandleBlockFriend}>
      <span className="icon material-symbols-outlined">
     {"circle"}  
      </span> 
      <span> Block </span>
      </button>
      </div>
        </tbody>
        </table>
        </div>
        </>
    )
}
export default DisplayUserHome;