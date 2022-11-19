import react from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import'./Carreer.css'
import DisplayMatchHistory from './DisplayMatchHistory';
const Carreer = () => {
    const [History,setHistory] = useState<any>([]);
    const [user42,SetUser42] = useState<any>([]);
  const loggeduser = localStorage.getItem("user");
if (loggeduser)
{
    var Current_User = JSON.parse(loggeduser);
    
}
    const MatchHistory = [
        {MatchId:0,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:50227,P2nickname:"mazoko",P2image_url:"/images/AccountDefault.png",finalScore:"10-8",winner:true},
        {MatchId:1,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:50227,P2nickname:"mazoko",P2image_url:"/images/AccountDefault.png",finalScore:"12-8",winner:true},
        {MatchId:2,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:50229,P2nickname:"test56",P2image_url:"/images/AccountDefault.png",finalScore:"2-3",winner:false},
        {MatchId:3,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:50231,P2nickname:"test",P2image_url:"/images/AccountDefault.png",finalScore:"10-2",winner:true},
        {MatchId:4,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:50220,P2nickname:"mazoko",P2image_url:"/images/AccountDefault.png",finalScore:"18-2",winner:true},
        {MatchId:5,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:50225,P2nickname:"test",P2image_url:"/images/AccountDefault.png",finalScore:"25-2",winner:true},
        {MatchId:6,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:125,P2nickname:"test",P2image_url:"/images/AccountDefault.png",finalScore:"4-20",winner:false},
        {MatchId:7,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:125,P2nickname:"test",P2image_url:"/images/AccountDefault.png",finalScore:"4-20",winner:false},
        {MatchId:8,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:125,P2nickname:"test",P2image_url:"/images/AccountDefault.png",finalScore:"4-20",winner:false},
        {MatchId:9,userId:50213,nickname:"narjdal",image_url:Current_User.image_url,P2UserId:125,P2nickname:"test",P2image_url:"/images/AccountDefault.png",finalScore:"100-20",winner:false},
   
    ];
    useEffect(() => {
  const loggeduser = localStorage.getItem("user");
    
  if(loggeduser)
  {
    var Current_User = JSON.parse(loggeduser);
    // console.log("=>>>>> FROM THE ACCOUNT " + loggeduser   + Current_User.nickname + Current_User.UserId)
    SetUser42(Current_User);
    // Request to Backend pour avoir lhistorique des match du User , en fonction de son id ? 

}

    },[])

    return (
        <>
           <div className='body'>
      <div className='carreer-card'>
        <h3>Game History  </h3>
      <span>{MatchHistory.map(c => < DisplayMatchHistory  key = {c.MatchId} match ={c} />)}</span>
      </div>
      </div>
        </>
    )
}

export default Carreer;