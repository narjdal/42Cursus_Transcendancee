import react from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import'./Carreer.css'
import DisplayMatchHistory from './DisplayMatchHistory';
const Carreer = () => {
    const [History,setHistory] = useState<any>([]);
    const [user42,SetUser42] = useState<any>([]);
    const [MatchHistory,setMatchhistory] = useState<any>([]);
    const [done,setDone] = useState(false);

    async function FetchGameHistory() {

      const loggeduser = localStorage.getItem("user");
     if (loggeduser) {
       const current = JSON.parse(loggeduser);
       console.log("Fetching Game History Of this User : from caarreer         => " ,current.nickname)
   
   
       await fetch((`http://localhost:5000/player/gameHistoryById/${current.nickname}`
       ), {
         // mode:'no-cors',
         method: 'get',
         credentials: "include"
       })
   
   
   
         .then((response) => response.json())
         .then(json => {
           console.log("The gameHistoryById is => " + JSON.stringify(json))
           if(json.history)
           {
          //  setMiniHistory(json.history)
        setMatchhistory(json.history);
        setDone(true);

           }
   
           if(json.statusCode == "404")
           {
            console.log("404")
          //  setErrorMessage(json.message);
   
           }
   
           return json;
         })
         .catch((error) => {
           console.log("An error occured : " + error)
           // setRelation("error");
          //  setErrorMessage("An error occured! gameHistoryById not found ! ");
           return error;
         })
   
     }
   }
    useEffect(() => {
  const loggeduser = localStorage.getItem("user");
    
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
    // console.log("=>>>>> FROM THE ACCOUNT " + loggeduser   + Current_User.nickname + Current_User.UserId)
    SetUser42(Current_User);

        const ss = [
            {MatchId:0,userId:50213,nickname:Current_User.nickname,image_url:Current_User.avatar,P2UserId:50227,P2nickname:"mazoko",P2image_url:"/images/AccountDefault.png",finalScore:"10-8",winner:true},
            {MatchId:1,userId:50213,nickname:Current_User.nickname,image_url:Current_User.avatar,P2UserId:50227,P2nickname:"mazoko",P2image_url:"/images/AccountDefault.png",finalScore:"12-8",winner:true},
            {MatchId:2,userId:50213,nickname:Current_User.nickname,image_url:Current_User.avatar,P2UserId:50229,P2nickname:"test56",P2image_url:"/images/AccountDefault.png",finalScore:"2-3",winner:false},
            {MatchId:3,userId:50213,nickname:Current_User.nickname,image_url:Current_User.avatar,P2UserId:50231,P2nickname:"test",P2image_url:"/images/AccountDefault.png",finalScore:"10-2",winner:true},
       
        ];
    // Request to Backend pour avoir lhistorique des match du User , en fonction de son id ? 

}

    },[])

    return (
        <>
           <div className='body'>
      <div className='carreer-card'>
        <h3>Game History  </h3>

      <span>{MatchHistory.map(c => < DisplayMatchHistory  key = {c.MatchId} match ={c} />)}</span>
      {done ? (
        <>
        </>
      ) : (
        <>
        No Game History foudn for this user.

        </>
      )}
      </div>
      </div>
        </>
    )
}

export default Carreer;