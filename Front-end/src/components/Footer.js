import React, {useState} from 'react';
import {Link} from'react-router-dom';
import './Footer.css'

function Footer() {
    const [click,setClick]= useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false);
  return (
    <nav className='Footer'>
    <img src='/images/ping-pong_1f3d3.png' height="35"/>
        <div className='Footer-container'>
       <ul>
        <li>
         <Link  to="/AboutUs" className="Footer-logo">
        About Us
        </Link>
        </li>
        <li><Link  to="/HowToPlay" className="Footer-logo">
        HowToPlay 
        </Link>
        </li>

       <li> <div className='menu-icon' onClick={handleClick}>
        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        </li>
        </ul>
    </div>

    </nav>
    
    )
}

export default Footer