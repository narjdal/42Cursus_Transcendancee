import react from "react"
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const SpectateGame = () => {

const params = useParams();

useEffect(() => {
const roomId = params.gameId;
if(roomId)
{

}
},[])

    return(
        <>
    <div className="SpectateGame-Card">
        <ul className="chat-room-list">
            <li>
        Games
            </li>
        </ul>
    </div>
        </>
    )
}

export default SpectateGame;