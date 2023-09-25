import io from 'socket.io-client';
import React, { useEffect } from 'react';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const url = process.env.REACT_APP_SERVER;

const useSocketStore = create((set, get) => ({

    socket: io(url),
    connect: () => {
        const socket = io(url);
        set({ socket });
    },
    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
    

}));

export default useSocketStore;