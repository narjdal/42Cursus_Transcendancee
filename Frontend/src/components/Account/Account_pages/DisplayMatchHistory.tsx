import { match } from 'assert';
import react from 'react'
import {useState, useEffect} from 'react'
import {Link} from'react-router-dom';

import './DisplayMatchHistory.css'
const DisplayMatchHistory = (props) => {
    const [isWinner,setIsWinner] = useState(false);
    const [ennemyNickname,setEnnemyNickname] = useState("");

    useEffect(() => {
        const logged = localStorage.getItem("user");
        if (logged){
            const current = JSON.parse(logged)
            {
                if (props.match.winner_id == current.id)
                {
                    console.log( " I won ! ");
                    setIsWinner(true);
                    // setEnnemyNickname(props.match.losser.nickname)
                }
                else
                {
                    setIsWinner(false);
                    // setEnnemyNickname(props.match.winner.nickname)

                }

            }
        }

    },[])
console.log(" History Props : " , props)
    return (
        <>
 {isWinner ? (
 <>
 <div className='winner-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"military_tech"}  Victory      </span> 
      </button>
      </div>
 </>
) : (
    <>
    <div className='loser-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"smart_outlet"}  Defeat      </span> 
      </button>
      </div>
    </>
)}

<div className="Match-History"> 
    <table className="History-Table">
        <tbody>
   <tr>
    <th></th>
    <th>   <div className='neutral-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"person"}        </span> 
      </button>
      </div></th>
    <th>
   <div className='neutral-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"stadia_controller"}        </span> 
      </button>
      </div>
   </th>
   <th>   <div className='neutral-div'>
      <button type="button" className='has-border' >
      <span className="icon material-symbols-outlined">
     {"person"}        </span> 
      </button>
      </div></th>
</tr>
<tr>
<td>
   <img src = {props.match.image_url}  className="avatar1" height="35"/>
</td>
<td>
{/* {props.match.winner_id} */}
winner Nickname 
</td>
    
<td>
    {props.match.winner_score}
</td>
 <td> {props.match.losser_score}</td>
<td> <Link style={{color:'#1e90fe'}} to={`/users/${props.match.looser_id}`} >   Send Loser Nickname </Link>
</td>


<td>
    
   <img src = {props.match.P2image_url}  className="avatar"/>
</td>
    </tr>
    </tbody>
    </table>
    </div>
        </>

    )
}


export default DisplayMatchHistory;