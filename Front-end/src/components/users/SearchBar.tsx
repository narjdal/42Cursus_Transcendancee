import React, { useState } from "react";
import DisplayUserHome from "./DisplayUserHome";

const SearchBar = () => {
  const [userQuery,setUserQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    const [usertoShow,setUsertoShow] = useState<any>([]);
    const[display,setDisplay] = useState(false);
  async function FetchUserInfos ()  {


console.log("Fetching User Profile  Infos  Home Page  => " + userQuery);

const endpoint = 'http://localhost:5000/player/myprofile'
console.log(" this endpoint ( TODO ) " + endpoint)

// await fetch(endpoint,{
//     // mode:'no-cors',
//     method:'get',
//     credentials:"include"
// })

// .then((response) => response.json())
// .then(json => {
    const loggeduser = localStorage.getItem("user");
if(loggeduser)
{
  var Current_User = JSON.parse(loggeduser);
  const {id} = Current_User
setUsertoShow(Current_User);
console.log("Waiting for the backend endpoint ...");
  // console.log("Fetching Friends of this User " + id);

}
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

};

  const HandleFetchUser = (e) => {
    e.preventDefault();
    console.log("inside Handle fetch user" + userQuery)
  if(!userQuery)
  {
    setErrorMessage("An Error Occured ! ");
  }
  else
  {
    FetchUserInfos();
setDisplay(true);
  }
};

return (
    <>
    <div className="searchForm">
    <form onSubmit={HandleFetchUser}>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={event => setUserQuery(event.target.value)}
       value={userQuery || ""}
        />
   
        </form>
        {errorMessage && <div className="error"> {errorMessage} </div>}
        </div>
         {display ? ( 
            <>
         <DisplayUserHome  user={usertoShow} /> 
       </>
         ): (
            <>

            </>
         )}
    </>

)
};

export default SearchBar