import react, { useEffect } from 'react';
import { useState } from "react";
import person from '../users/users.json'
import {Routes, Route, useNavigate} from 'react-router-dom';
import './ProfilePicUpload.css'
// https://stackoverflow.com/questions/23427384/get-form-data-in-reactjs
const ProfilePicUpload = (props) => {
	// const [user42,SetUser42] = useState <any>([]);
	const [selectedFile, setSelectedFile] = useState([]);
	const [nickName, setNickName] = useState("");
	const [isFilePicked, setIsFilePicked] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
    const navigateAccount = () => {
        // 👇️ navigate to /contacts
        navigate('/Account');
      };

    const handlePseudoChange = (e) => {
        e.preventDefault()
        console.log("nickame :" + e.target[0].value);
        setNickName(e.target[0].value);

      }
	const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked("true");
        event.preventDefault()
	};
// useEffect (() => {
// 	const authenticated = localStorage.getItem("authenticated");
// 	const loggeduser = localStorage.getItem("user");
// 	if(loggeduser)
// 	{
// 		var Current_User = JSON.parse(loggeduser);
// 		console.log("=>>>>> FROM THE DashBoard "   + Current_User.usual_full_name + Current_User.UserId)
// 		SetUser42(Current_User);
// 	}

// },[])
	const handleSubmission = () => {
        const formData = new FormData();
		const MyForm = [
			{ file:selectedFile,nickName:nickName}
		]
		// formData.append('File', selectedFile);
        // formData.append('nickname',nickName);
        console.log("Handle Submission : " + nickName)
        if(nickName)
        {
		// fetch(
		// 	'https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>',
		// 	{
		// 		method: 'POST',
		// 		body: formData,
		// 	}
		// )
		// 	.then((response) => response.json())
		// 	.then((result) => {
		// 		console.log('Success:', result);
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error:', error);
		// 	});
		navigateAccount();
        }
        else
        {
            setErrorMessage("Please chose a valid username ");
            
        }
        };

	return(
   <div className='body'>
      <div className='login-card'>
		<h2> Welcome to your Dashboard  {props.ProfileInfo.name} !  </h2>
		   <img src={props.ProfileInfo.ProfilePic} height="35"/>
		 <h3>  Please chose a Profile picture : </h3>
     
		<form className='login-form'>
			<input type="file" name="file" onChange={changeHandler} />
			{isFilePicked == "true" ? (
				<div>
					<p>Filename: {selectedFile['name']}</p>
					<p>Filetype: {selectedFile['type']}</p>
					<p>Size in bytes: {selectedFile['size']}</p>
					<p>
						lastModifiedDate:{' '}
						{selectedFile['lastModifiedDate'].toLocaleDateString()}
					</p>
				</div>
			) : (
				<p>Select a file to show details</p>
			)}
				<button type ="submit" onClick={handleSubmission}>Submit</button>
                {errorMessage && <div className="error"> {errorMessage} </div>}
      </form>
				</div>
		</div>
	)
};

export default ProfilePicUpload ;