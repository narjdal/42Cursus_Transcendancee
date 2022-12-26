import react from "react"
import { useParams } from "react-router-dom";
import { useEffect , useState } from "react";
import io from "socket.io-client";
import GameLive from "../Game/gameLive";
export type IroomsPong = {
    gameId : number,
    playerLeft: {
      name: string;
      score: number;
    };
    playerRight: {
      name: string;
      score: number;
    };
};

const SpectateGame = () => {

    const [rooms, setRooms] = useState<any>([]);
    const params = useParams();
    const [gameId,setgameId] = useState("");

useEffect(() => {
    const gameId = params.id;
    console.log("Inside Spectate game ! " ,gameId)

    if(gameId)
    {
        setgameId(gameId)
        const back_url :string = process.env.REACT_APP_BACK_URL + "/game";
        let socket = io(back_url);

            socket.on("connect", () => {
      
        }); 

        console.log("Emiting here ! ")
        socket.emit ("watchGame",{
            gameId:gameId,
            user:localStorage.getItem("user")!
        });
    }
    },[])

        return(
            <>
        <div className="SpectateGame-Card">

            <GameLive roomId = {gameId }width = "600" height="400" />
    </div>
        </>
    )
}

export default SpectateGame;