import react from 'react'
import {useState,useEffect} from 'react'
import './Social.css'
import DisplaySocial from './DisplaySocialList'
const Social = () => {
    console.log("INSIDE SOCIAAAAAAL")
    const FriendsList = [
        {id:0,UserId:50223,nickname:"narjdal",username:"narjdal",name:"narjdal",image_url:"/images/AccountDefault.png"},
        {id:1,UserId:50229,nickname:"mazoko",username:"mazoko",name:"mazoko",image_url:"/images/AccountDefault.png"},
        {id:2,UserId:50231,nickname:"testPlayer",username:"testPlayer",name:"testPlayer",image_url:"/images/AccountDefault.png"},
        {id:3,UserId:50233,nickname:"test",username:"test",name:"test",image_url:"/images/AccountDefault.png"},
        {id:4,UserId:50235,nickname:"Friend4",username:"Friend4",name:"Friend4",image_url:"/images/AccountDefault.png"},
        
    ];
    return (
        <>
        <div className='body'>
            <div className='Social-card'>
                <h3>Social</h3>
            <span>{FriendsList.map(c => < DisplaySocial  key = {c.id} Friends ={c} />)}</span>

            </div>
        </div>
        </>
    )
}

export default Social;