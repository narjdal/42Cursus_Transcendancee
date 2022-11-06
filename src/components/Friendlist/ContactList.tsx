import React from "react";

import Contact from "./Contact";
import { useState ,useEffect} from "react";
import './ContactList.css'

const ContactList = (props) => 
{
    const [AddFriend,setAddFriend] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [ContactList,setContactList] = useState([]);
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [user42,SetUser42] = useState<any>([])
    useEffect(() => {
        const loggeduser = localStorage.getItem("user");
    
        if(loggeduser)
        {
          var Current_User = JSON.parse(loggeduser);
          console.log("=>>>>> FROM THE NAVBAR "   + Current_User.nickname + Current_User.UserId)
          SetUser42(Current_User);
        }
    },[]);

//   const handleSearch = async () => {

//     // const q = query(
//     //   collection(db, "users"),
//     //   where("displayName", "==", username)
//     );
    async function handleSearch() {

    };
    const handleSelect = (e) => {
        // e.code == "select"
        // e.code === "Enter" && handleSearch();
      };
    const handleKey = (e) => {
        e.preventDefault();
        // e.code === "Enter" && handleSearch();
        SetUser42(null);
    // setUsername("")
    };
    const HandleAddFriend = (e) => {
        e.preventDefault();
        console.log("=>>> " + username);
        setErrorMessage("No User found ! " );
        
        if (AddFriend)
        {
            {
                // POST request to Backend , with User Name  of the friend to add 
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
                //Const UpadtedContacts = respobnse.json
                //setContactList(UpadtedCOntacts);
                //Send UpadtedContacts to Contact Component to keep the friendlist Up to date 
        }
    }
};
    return (
        
        <div className="FriendList-container">
              <div className="search">
      <div className="searchForm">
        <input
          type="text"
          className ="AddUserInput"
          placeholder="Find a user"
          onChange={event => setUsername(event.target.value)}
       value={username || ""}
        />
        <button type ="submit" onClick={HandleAddFriend}> <img src ="/images/Add.png" className="FriendAddIcon" height="30"/></button>
      </div>
      {errorMessage && <div className="error"> {errorMessage} </div>}
      {user42 && (
        <div className="userChat" onClick={handleSelect}>
          <div className="userChatInfo">
          <span>{props.contacts.map(c => < Contact  key = {c.name} user ={c} />)}</span>
          </div>
        </div>
      )}
    </div>
</div>
    );
};
export default ContactList;