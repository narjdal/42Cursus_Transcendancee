import react from 'react'
import { useState,useEffect } from 'react';
import './Achievements.css'
import DisplayAchievementsList from './DisplayAchievementsList';
const Achievements = () => {
const [AchievementsList,setAchievementsList] = useState<any>([])

    async function FetchAchivementsList  ()  {
        const loggeduser = localStorage.getItem("user");
        if (loggeduser) {
          const current = JSON.parse(loggeduser);
          console.log("Fetching AchievementsList  Of this User : Inside Achievements Page         => " ,current.nickname)
      
      
          await fetch((`http://localhost:5000/player/achivement/${current.nickname}`
          ), {
            // mode:'no-cors',
            method: 'get',
            credentials: "include"
          })
      
      
      
            .then((response) => response.json())
            .then(json => {
              console.log("The AchievementsList is => " + JSON.stringify(json))
       
              
              if(json.getAchivements)
              {
              setAchievementsList(json.getAchivements);
      
              }
      
              if(json.statusCode == "404")
              {
              // setErrorMessage(json.message);
      
              }
      
              return json;
            })
            .catch((error) => {
              console.log("An error occured : AchievementsList " + error)
              // setRelation("error");
              // setErrorMessage("An error occured! gameHistoryById not found ! ");
              return error;
            })
      
        }
      }
useEffect(() => {
    const loggeduser = localStorage.getItem("user");
    if (loggeduser)
    {
        var Current_User = JSON.parse(loggeduser);
    FetchAchivementsList();
        
    }

},[])


    return (
        <>
        <div className='body'>
            <div className='Achievements-card'>
                
      <span>{AchievementsList.map(c => < DisplayAchievementsList  key = {c.id} AchievementsList ={c} />)}</span>

            </div>
        </div>
        </>

    );
};

export default Achievements;