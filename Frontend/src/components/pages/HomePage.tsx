import React from 'react';
import BLoggin from '../login/login';
import { useEffect, useState } from "react";
import SearchBar from '../users/SearchBar'
import DisplayMatchHistory from '../Account/Account_pages/DisplayMatchHistory';
import './HomePage.css'
import { IsAuthOk } from '../../utils/utils';

const Home = () => {
  const [authenticated, setauthenticated] = useState("");
  const [MatchHistory,setMatchHsitory] = useState<any>([]);
  const loggeduser = localStorage.getItem("user");

async function FetchAllGamesHistory()
{
  const loggeduser = localStorage.getItem("user");
  if (loggeduser) {
    const current = JSON.parse(loggeduser);
    console.log(" allGameHistory        => " )


    await fetch((process.env.REACT_APP_BACK_URL + '/player/allGameHistory/'
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })



      .then((response) => response.json())
      .then(json => {
        console.log("The allGameHistory is => " + JSON.stringify(json.history))
        if(IsAuthOk(json.statusCode) == 1)
        {
          window.location.reload();
        }
        else
        {
    setMatchHsitory(json.history)

        }
        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        return error;
      })

  }
}
  useEffect(() => {
    const authenticated = localStorage.getItem("authenticated");
    const loggeduser = localStorage.getItem("user");
    // console.log("HomePage Is User Auth ?  " + authenticated);
  
    if (loggeduser)
{
    var Current_User = JSON.parse(loggeduser);

    FetchAllGamesHistory();
    
}




    if (authenticated) {
      setauthenticated(authenticated);
    }
  }, []);
  const loggedInUser = localStorage.getItem("authenticated");

    return (
      
  <div>  {loggedInUser == "true" ? (

    <>
          <SearchBar/>
            <div className='carreer-card'>
        <h3> Global History  </h3>
      <span>{MatchHistory.map(c => < DisplayMatchHistory  key = {c.id_game_history} match ={c} />)}</span>
      </div>
      
            </>
      ) : (
        <div className="soloLogin">
      <BLoggin/>
      </div>
    )}
    </div>

    )
}
  
export default Home;