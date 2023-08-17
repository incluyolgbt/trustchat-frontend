import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io('/');

function useConnection(){
    useEffect(()=>{
        socket.on('connect', () => {
            console.log('connected');
        });

        return () => {
            socket.on('disconnect', ()=>{
                console.log('disconnected');
            });
        }
    }, []);

    const connection = socket.connected;

    return {
        connection, socket
    }

}

export {useConnection}