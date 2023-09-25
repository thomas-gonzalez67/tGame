import './App.css';
import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import { useRecoilState, useRecoilValue } from 'recoil';
import { codeState, isSelectedState } from './atoms.js';

import useSocketStore from './useSocketStore.js'


const Lobby = () => {
    
    const [code, setCode] = useRecoilState(codeState);
    const [isSelected, setIsSelected] = useRecoilState(isSelectedState);
    const socket = useSocketStore((state) => state.socket);



    return (
        <div className='d-flex flex-column align-items-center mt-5'>
        <h1 className='text-light'></h1>
            {isSelected && <button type="button" onClick={()=>socket.emit("startGame",(code))} className='btn btn-outline-danger text-white bg-black w-75'> START GAME</button>}
            {!isSelected && <h1 className='text-light'>relax boyo</h1> }
        </div>
    )
    
}

export default Lobby