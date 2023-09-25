import './App.css';
import React, { useState, useEffect } from "react";
import { useRecoilState, atom } from 'recoil';
import { pageState, codeState, idState, popUpState, isSelectedState } from './atoms.js';
import PopUp from './Components/PopUp';  
import GameScreen from './GameScreen';
import useSocketStore from './useSocketStore.js'
import LandingPage from './LandingPage';
import Lobby from './Lobby';





function App() {

    const socket = useSocketStore((state) => state.socket)
    const [code, setCode] = useRecoilState(codeState);
    const [id, setId] = useRecoilState(idState);
    const [page, setPage] = useRecoilState(pageState);
    const [message, setMessage] = useRecoilState(popUpState);
    const [isSelected, setIsSelected] = useRecoilState(isSelectedState);
    const [popUp, setPopUp] = useState(false);

    useEffect(() => {
        socket.on("kickedOut", () => {
            setCode('');
            setId('');
            setMessage("ROOM NO LONGER EXISTS")
            setPage('home');
            setIsSelected(false);
            setPopUp(true);
            
            
        })



        socket.on("noJoin", () => {
            setMessage('ROOM NOT FOUND');
            setPopUp(true);
        });

        socket.on("hasJoined", () => {
            setId(socket.id);
            setPage("lobby")
            setPopUp(false);
        });

        socket.on("reset", () => {
            setCode('');
            setId('');
            setIsSelected(false);
        })

        socket.on("rejoining", () => {
            setPage("gameScreen")
        })

        socket.on("Update", () => {
            setIsSelected(true);
        })

        socket.on("ToGameScreen", () => {
            setPage("gameScreen");
        });



    }, [])

  return (
      <div className="App gray">
                  <div className='header '>
                <h1 className='text-center mt-3 text-danger'>
                    TORTURE PARTY
                </h1>
                
            </div>
          {popUp == true && <PopUp popped={setPopUp} />}
          {page == 'home' && <LandingPage />}
          {page == 'lobby' && <Lobby />}
          {page=='gameScreen' && <GameScreen /> }

    </div>
  );
}

export default App;
