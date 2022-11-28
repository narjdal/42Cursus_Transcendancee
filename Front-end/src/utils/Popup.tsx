import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useState } from 'react';
import './Popup.css'
const Pop = (props) => {
const [Roompassword,setRoomPassword] = useState("");
const [isUpdating,setIsUpdating] = useState(false);
const [Updated,setUpadted] = useState(false);
const [errorMessage,setErrorMessage] = useState("");


const [showinput,setInput] = useState(false);
const HandleShowPassword = (e) => {
    e.preventDefault();
    setInput(!showinput)
}

const HandleEnterProtectedRoom = (e) => {
    e.preventDefault();
    console.log("Inside Protected room ")
    if(!Roompassword)
    {
        setErrorMessage("Please enter a valid password.");
    }
    setErrorMessage("Waiting for backend endpoint ....");

}
return (
  <Popup trigger ={
  <button type="button" className='has-border' onClick={HandleShowPassword}>
      <span className="icon material-symbols-outlined">
     {"lock"}    {props.room.name}    </span>
      </button> 
      }    
    position="bottom center">
    <div className='ProfilePic-textBox'>
    <input type="password"
       className={`${Roompassword ? "has-value" : ""}`}
	   id="textbox"
       onChange={event => setRoomPassword(event.target.value)}
       value={Roompassword || ""}
       />
       <label htmlFor='textbox'> Password : </label>
    {errorMessage && <div className="error"> {errorMessage} </div>}
     <button onClick={HandleEnterProtectedRoom}> Submit</button>
    </div>
  </Popup>
)
}

export { Pop };
