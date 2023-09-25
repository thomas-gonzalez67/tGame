import './App.css';
import React, { useState, useEffect } from "react";
import { useRecoilState, atom } from 'recoil';
import { pageState, codeState, idState, popUpState, isSelectedState } from './atoms.js';
import useSocketStore from './useSocketStore.js'



const GameScreen = () => {
    const socket = useSocketStore((state) => state.socket);
    const [code, setCode] = useRecoilState(codeState);
    const [idBox, setId] = useState("");
    const [takeDrink, setTakeDrink] = useState(0);
    const [giveDrink, setGiveDrink] = useState(0);
    const [ok, setOk] = useState(false);
    const [spinButton, setSpinButton] = useState(false);
    const [votePlayer, setVotePlayer] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [options, setOptions] = useState([]);
    const [voteOptions, setVoteOptions] = useState([]);
    const [sacraficeButtons, setSacraficeButtons] = useState(false);
    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const [targets, setTargets] = useState([]);
    const [murderWeapons,setMurderWeapons] = useState(['Gaurd', 'Reload', 'Slash All']);
    const [showMurderWeapons, setShowMurderWeapons] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [bullets, setBullets] = useState(0);
    const [ghostMode, setGhostMode] = useState(false);




    const endRound = (code, option) => {
        socket.emit("sendResult", code, option);
        setOptions([]);
    }

    const Spin = (code) => {
        socket.emit("spinWheel", code);
        setSpinButton(false);
    }

    const Continue = (code) => {
        socket.emit("continue", code);
        setOk(false);
    }

    const chooseBox = (idBox, boxName, code) => {
        socket.emit("returnBox", {id: idBox, box: boxName }, code);
        setBoxes([]);
    }

    const vote = (player, votedFor, code) => {
        player.Vote = votedFor.Name;
        socket.emit("sendVote", player, code);
        setVoteOptions([]);
    }

    const Sacrafice = (code) => {
        socket.emit("SacraficeHim", code);
        setSacraficeButtons(false);
    }

    const sendButton = (player, button, code) => {
        var numButton = parseInt(button) - 1;
        button = numButton.toString();
        console.log(button);
        player.ButtonGuess = button;
        setShowButtons(false);
        socket.emit("returnButton", player, code);
    }

    const UseMurderWeapon = (code, player, weapon) => {
        setGhostMode(false);
        setShowMurderWeapons(false);
        setTargets([]);
        if (weapon === 'Gaurd') {
            player.Gaurd = true;
            player.Weapon = 'Gaurd'
        }
        if (weapon === 'Reload') {
            player.Ammo++;
            player.Weapon = 'Reload'
        }

        if (weapon === 'Slash All') {
            player.Weapon = 'Slash All'
        }

        if (weapon === 'Nothing') {
            player.Weapon = 'Nothing'
        }


        if (weapon === 'LIGHTNING') {
            player.Weapon = 'LIGHTNING'
        }

        if (weapon !== 'Gaurd' && weapon !== 'Reload' && weapon !== 'Slash All' && weapon !== 'Nothing' && weapon !== 'LIGHTNING') {
            player.Target = weapon;
            player.Weapon = 'Shoot';
        }


        
        socket.emit("ReturnWeapon", code, player);
    }

    const UseGhostBuff = (code, player, weapon) => {
        setGhostMode(false);
        setTargets([]);
        player.Target = weapon;
        player.Weapon = 'Buff';
        setGhostMode(false);

        socket.emit("ReturnWeapon", code, player);
    }

    const UseGhostDebuff = (code, player, weapon) => {
    
        setGhostMode(false);
        setTargets([]);
        player.Target = weapon;
        player.Weapon = 'Debuff';


        socket.emit("ReturnWeapon", code, player);
    }

    useEffect(() => {
        socket.on("showOptions", (playerOne, playerTwo, oneId, twoId) => {
            setOptions([...options, { name: playerOne, id: oneId }, { name: playerTwo, id: twoId }]);
        });

        socket.on("ShowEveryone", (players) => {
            var newPlayers = [];
            players.map(player => newPlayers.push({ name: player.Name, id: player.Id }));
            newPlayers.map(player => console.log(player.name, player.id));
            setOptions(newPlayers);
            
        });

        socket.on("showBoxes", (id, box) => {
            setId(id);
            setBoxes(...boxes, box);
        });

        socket.on("showDrinksTaken", (sipsTaken) => {
            console.log(sipsTaken);
            setTakeDrink(sipsTaken);
        });

        socket.on("showDrinksGiven", (sipsGiven) => {
            console.log(sipsGiven);
            setGiveDrink(sipsGiven);
        });

        socket.on("resetPhoneSips", () => {
            setGiveDrink(0);
            setTakeDrink(0);
        });

        socket.on("clearBoxes", () => {
            setBoxes([]);
        });

        socket.on("pressOk", () => {
            setOk(true);
        })

        socket.on("showSpinButtonPhone", () => {
            setSpinButton(true);
        })

        socket.on("showVoteOptions", (player, list) => {
            setVotePlayer(player);
            setVoteOptions(list);
        })


        socket.on("showButtons", (player) => {
            console.log("showing")
            setVotePlayer(player);
            setShowButtons(true);
        })

        socket.on("SacraficeCounter", () => {
            setSacraficeButtons(true);
        })

        socket.on("GetMurderTools", (player, targetList) => {
            if (player.Special > 2) {
                setMurderWeapons([...murderWeapons, "LIGHTNING"]);
            }
            if (player.Special < 3) {
                setMurderWeapons(['Gaurd', 'Reload', 'Slash All']);
            }

            setBullets(player.Ammo);
            setVotePlayer(player);
            var newPlayers = [];
            targetList.map(player => newPlayers.push({ name: player.Name, id: player.Id }));
            newPlayers.map(player => console.log(player.name, player.id));
            setTargets(newPlayers);
            if (player.Ammo > 0) {
                setTargets(newPlayers);
            }
            setShowMurderWeapons(true);
        })

        socket.on("GetGhostTools", (player, targetList) => {
            setVotePlayer(player);
            setShowMurderWeapons(false);
            var newPlayers = [];
            targetList.map(player => newPlayers.push({ name: player.Name, id: player.Id }));
            newPlayers.map(player => console.log(player.name, player.id));
            setTargets(newPlayers);
            setGhostMode(true);
        })

    }, []);

    return (
        <div className='d-flex flex-column align-items-center mt-5'>
            {takeDrink != 0 && <h1 className='text-light'>Take {takeDrink} sips</h1>}
            {giveDrink != 0 && <h1 className='text-light'>Give {giveDrink} sips</h1>}
            {spinButton && <button className='btn btn-outline-danger bg-black w-50 text-light mt-2' onClick={() => Spin(code)} type="button">SPIN </button>}}
            {ok && <button className='btn btn-outline-danger bg-black w-50 text-light mt-2' onClick={() => Continue(code) } type="button">CONTINUE </button> }
            {options.map(option =>
                <div className='text-light w-50'>
                    <li className='list-unstyled' key={option.Id}>
                        <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => endRound(code, option.id)} type="button">{option.name}</button>
                    </li>
                    
                </div>)};

            {boxes.map(box =>
                <div className='text-light w-50'>
                    <li className='list-unstyled' key={box}>
                        <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => chooseBox(idBox,box, code)} type="button">{box}</button>
                    </li>

                </div>)};

            {voteOptions.map(box =>
                <div className='text-light w-50'>
                    <li className='list-unstyled' key={box.Id}>
                        <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => vote(votePlayer, box, code)} type="button">{box.Name}</button>
                    </li>

                </div>)};

            {sacraficeButtons && <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => Sacrafice(code)} type="button">SACRAFICE</button>}

            {showButtons && buttons.map(button =>
                <div className='text-light w-50'>
                    <li className='list-unstyled' key={button}>
                        <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => sendButton(votePlayer, button, code)} type="button">{button}</button>
                    </li>

                </div>)};

            {showMurderWeapons && murderWeapons.map(weapon =>

                <div className='text-light w-50'>
                    <li className='list-unstyled' key={weapon}>
                        <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => UseMurderWeapon(code, votePlayer, weapon)} type="button">{weapon}</button>
                    </li>
                </div>)};

            {showMurderWeapons && <div className='text-light' >You have {bullets} bullets left.</div>}

            {showMurderWeapons && targets.map(target =>
                <div className='text-light w-50'>
                    <li className='list-unstyled' key={target.Id}>
                        <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => UseMurderWeapon(code, votePlayer, target.id)} type="button">{target.name}</button>
                    </li>

                </div>)};

            {ghostMode && <div className='text-light'>BUFF</div> }

            {ghostMode && targets.map(target =>
                <div className='text-light w-50'>
                    <li className='list-unstyled' key={target.Id}>
                        <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => UseGhostBuff(code, votePlayer, target.id)} type="button">{target.name}</button>
                    </li>

                </div>)};

            {ghostMode && <div className='text-light'>HAUNT</div>}

            {ghostMode && targets.map(target =>
                <div className='text-light w-50'>
                    <li className='list-unstyled' key={target.Id}>
                        <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => UseGhostDebuff(code, votePlayer, target.id)} type="button">{target.name}</button>
                    </li>

                </div>)};

            {ghostMode && <button className='btn btn-outline-danger bg-black w-100 text-light mt-2' onClick={() => UseMurderWeapon(code, votePlayer, "Nothing")} type="button">"Honorable Ghost"</button>}



        </div>
    )
}






export default GameScreen;