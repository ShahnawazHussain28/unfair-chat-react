import { io } from "socket.io-client";
import React from 'react'
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { POST, URL } from "./config"
import { useContext } from "react";

const SocketClient = createContext();

export function useSocket(){
    return useContext(SocketClient);
}

export default function SocketProvider({ id, setId, children }) {
    const [socket, setSocket] = useState();

    useEffect(() => {
        const newSocket = io(URL, { query: { id } });
        setSocket(newSocket);
        POST("is-valid-user", { id }).then(res =>{
            if(!res.granted) setId("");
        })
        return () => newSocket.close();
    }, [id, setId]);

    let value = {
        socket
    }

    return (
        <SocketClient.Provider value={value}>
            {children}
        </SocketClient.Provider>
    )
}
