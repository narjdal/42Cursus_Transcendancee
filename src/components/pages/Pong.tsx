import React from 'react';
import TempoNav from '../TempoNav/NavbarGame';
import Game from '../Game/Game'
const Pong = () => {
  return (
    <div>
      <TempoNav/>
      <Game width = "400" height="400" />
    </div>
  );
};
  
export default Pong;