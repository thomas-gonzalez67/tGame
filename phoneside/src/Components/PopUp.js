import React, { useState, useEffect } from "react";
import { useRecoilState } from 'recoil'
import { popUpState } from '../atoms.js'

const PopUp = ({ popped }) => {

    const [message, setMessage] = useRecoilState(popUpState);

    const change = (e) => {
        popped(false);
    }

    return (
        <div className='center popped'>
            <div className="bg-danger text-white font-bold w-100 h-25 ">
            
                <div onClick={change} className='closebtn'>
                    x
                </div>
                <h4 className='pt-2 ms-3'>ERROR</h4>

            </div>
            <h1 className='mt-4 text-white text-center'>{message}</h1>
        </div>
        
    )
}

export default PopUp;