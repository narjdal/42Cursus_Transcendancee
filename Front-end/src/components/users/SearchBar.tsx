import React, { useState } from "react";
import DisplayUserHome from "./DisplayUserHome";

const SearchBar = () => {
  const [userQuery,setUserQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
    const [usertoShow,setUsertoShow] = useState<any>([]);
    const[display,setDisplay] = useState(false);



  async function FetchUserInfos ()  {
console.log("Fetching User Profile  Infos  Home Page  => " + userQuery);


    const loggeduser = localStorage.getItem("user");
if(loggeduser)
{
  var Current_User = JSON.parse(loggeduser);
  const {id} = Current_User
  // Here Create the User Infos for testing purpose change the relation && sender 
  const newUser = ({
    id:Current_User.id,
    name:Current_User.name,
    nickname:Current_User.nickname,
    avatar:Current_User.avatar,
    relation:"",
    sender:""
  }
  )
     
let endpoint = 'http://localhost:5000/player/?id=';
// endpoint = endpoint + userQuery;
console.log(" this endpoint   " + endpoint)


await fetch((`http://localhost:5000/player/${userQuery}`),{
    // mode:'no-cors',
    method:'get',
    credentials:"include"
})


.then((response) => response.json())
.then(json => {
    console.log("The response is => " + JSON.stringify(json))
  setErrorMessage(""); 

    setUsertoShow(json);
    return json;
})
.catch((error) => {
  console.log("An error occured : " + error)
  setUsertoShow([])
  setErrorMessage("An error occured! User not found ! ");
  return error;
})

// console.log("Waiting for the backend endpoint ...");
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
    setErrorMessage("An Error Occured ! ")
    setDisplay(false);
  }
  else
  {
    FetchUserInfos();
setDisplay(true);
  }
};
const HandleChange  = (e) => {
    setUserQuery(e.target.value);
    setDisplay(false);
}

return (
    <>
    <div className="searchForm">
    <form onSubmit={HandleFetchUser}>
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={HandleChange}
       value={userQuery || ""}
        />
   
        </form>
        {errorMessage && <div className="error"> {errorMessage} </div>}
        </div>
         {display ? ( 
            <>
         <DisplayUserHome  usertoshow={usertoShow} /> 
       </>
         ): (
            <>

            </>
         )}
    </>

)
};

export default SearchBar