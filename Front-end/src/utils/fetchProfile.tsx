import userEvent from "@testing-library/user-event";
import react from 'react'

async  function getProfile  ()  {

console.log("Fetching Profile Infos   => ");


// const auth =   await 
const endpoint = 'http://localhost:5000/player/myprofile'
console.log(" this endpoint " + endpoint)
await fetch(endpoint,{
    // mode:'no-cors',
    method:'get',
    credentials:"include"
})

.then((response) => response.json())
.then(json => {
    console.log("The response is => " + JSON.stringify(json))
  localStorage.setItem("authenticated","true");
  localStorage.setItem("user",JSON.stringify(json));
    return true;
})
.catch((error) => {
    console.log("An error occured : " + error)
    return false;
})

}

export default getProfile;
