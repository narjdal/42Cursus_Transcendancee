import React from 'react';
import BLoggin from '../login/login';
import { useEffect, useState } from "react";
import Top from '../Top/Top.json';
import TopComponent from '../Top/TopComponent';
import SearchBar from '../users/SearchBar'
import DisplayMatchHistory from '../Account/Account_pages/DisplayMatchHistory';
import './HomePage.css'

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


    await fetch((`http://localhost:5000/player/allGameHistory/`
    ), {
      // mode:'no-cors',
      method: 'get',
      credentials: "include"
    })



      .then((response) => response.json())
      .then(json => {
        console.log("The allGameHistory is => " + JSON.stringify(json.history))
    setMatchHsitory(json.history)

        // if(json.statusCode == "404")
        // {
        // setErrorMessage(json.message);

        // }

        return json;
      })
      .catch((error) => {
        console.log("An error occured : " + error)
        // setRelation("error");
        // setErrorMessage("An error occured! gameHistoryById not found ! ");
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

                {/* <div className='Top3'>
          <div className="box">
          <table className='center'>
            <tbody>
            <tr> */}
              {/* <th>  </th>
              <th> </th>
              <th> Rank </th>
              <th> Name</th>
              <th> Games</th>
              <th> Victories</th>
              <th> Winrate</th>
              <th> Status</th>
          </tr>
          <tr>
          
              <td>  <img src={Top[0].ProfilePic} height="35"/> </td>
              <td>  <img src={Top[0].TrophyPic} height="35"/> </td>
                <td> {Top[0].Rank}</td>
                <td> {Top[0].name}</td>
                <td>{Top[0].TotalGames}</td>
                <td>{Top[0].Victories}</td> */}
                {/* <td>{Top[0].winrate}</td> */}
              {/* {Top[0].isActive ? (
                      <td>  
                      <div className="icon-div">
  
                           <button type="button" className='has-border' >  
                   <span className="icon material-symbols-outlined">
                  {"check_circle"}        </span> 
                   </button>
                   </div>
                   
                      </td>
              ) : (
                <td> 
                <div className="icon-off-div">
             <button type="button" className='has-border' >  
          <span className="icon material-symbols-outlined">
         {"cancel"}        </span> 
          </button>
          </div>
             </td>
              )} */}

            {/* </tr>
            <tr>
            <td>  <img src={Top[1].ProfilePic} height="35"/> </td>
              <td>  <img src={Top[1].TrophyPic} height="35"/> </td>
                <td> {Top[1].Rank}</td>
                <td> {Top[1].name}</td>
                <td>{Top[1].TotalGames}</td>
                <td>{Top[1].Victories}</td>
                <td>{Top[1].winrate}</td> */}
              {/* {Top[1].isActive ? (
                      <td>  
                      <div className="icon-div">
  
                           <button type="button" className='has-border' >  
                   <span className="icon material-symbols-outlined">
                  {"check_circle"}        </span> 
                   </button>
                   </div>
                   
                      </td>
              ) : (
                <td> 
                <div className="icon-off-div">
             <button type="button" className='has-border' >  
          <span className="icon material-symbols-outlined">
         {"cancel"}        </span> 
          </button>
          </div>
             </td>
              )} */}

            {/* </tr>
            <tr>
            <td>  <img src={Top[2].ProfilePic} height="35"/> </td>
              <td>  <img src={Top[2].TrophyPic} height="35"/> </td>
              <td> {Top[2].Rank}</td>
               <td> {Top[2].name}</td>
                <td>{Top[2].TotalGames}</td>
                <td>{Top[2].Victories}</td>
                <td>{Top[2].winrate}</td> */}
              {/* {Top[2].isActive ? (
                       <td>  
                       <div className="icon-div">
   
                            <button type="button" className='has-border' >  
                    <span className="icon material-symbols-outlined">
                   {"check_circle"}        </span> 
                    </button>
                    </div>
                    
                       </td>
              ) : (
                      <td> 
                <div className="icon-off-div">
                 <button type="button" className='has-border' >  
              <span className="icon material-symbols-outlined">
             {"cancel"}        </span> 
              </button>
              </div>
                 </td>
              )} */}
{/* 
            </tr>
            </tbody>
            </table>
            </div>
            </div> */}


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