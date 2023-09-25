import './App.css';
import React, { useState, useEffect } from "react";
import { useRecoilState } from 'recoil';
import { pageState, codeState, idState } from './atoms.js';


import useSocketStore from './useSocketStore.js'


const LandingPage = () => {
    const socket = useSocketStore((state) => state.socket)


    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [gameCode, setGameCode] = useRecoilState(codeState);
    const [id, setId] = useRecoilState(idState);
    const [page, setPage] = useRecoilState(pageState);
    var player = { name: name, health: 30, shield: 0, poison: 0, poisonTurns:0, isDead: false, isSelected: false, id: 0 };

    const enterRoom = (e) => {
        e.preventDefault();
        setGameCode(code);
        console.log(gameCode);
        socket.emit("joinRoom", code, player);
    }

    const reconnect = (e) => {
        e.preventDefault();
        socket.emit("checkId", gameCode, id, socket.id)
    }


    return (
        <div>

            <form>
                <div className='d-flex flex-column align-items-center mt-5'>
                    <label className='d-flex flex-column w-75 text-white '>
                        <h3>Player Name:</h3>
                        <input className='box' autoComplete="off" type="text" maxLength="10" onChange={(e) => setName(e.target.value)} name="name" />
                    </label>
                    <label className='d-flex flex-column w-75 text-white mt-3'>
                        <h3>Code:</h3>
                        <input className='box text-uppercase' autoComplete="off" type="text" maxLength="4" onChange={(e) => setCode(e.target.value)} name="name" />
                    </label>
                    <div className='mt-5 w-75'>
                        {id == '' && < button type="button" disabled={name.length==0 || !(code.length==4)} className="btn btn-outline-danger bg-black w-100" onClick={enterRoom}>PLAY</button>}
                        {id != '' && < button type="button" className="btn btn-outline-black bg-danger w-100"  onClick={reconnect}>Reconnect</button>}
                    </div>
                </div>


            </form>
        </div>

    )


}

export default LandingPage;