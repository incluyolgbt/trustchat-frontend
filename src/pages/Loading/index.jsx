import { useState, useEffect, useContext } from 'react'
import { supabase } from '../../supabase/client';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context';
import './ChatsLoading.css'

//Aquí se hacen consultas a backend y se espera que mande información
// Mientras se carga página loading 
function Loading() {
    const { setError, userId, socket } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            if (!supabase.auth.getSession()) {
                navigate('/login');
            }

            //mandar a backend credenciales
            socket.once('connect', ()=>{
                socket.emit('authenticate', {
                    'user_id': userId
                });
            });

            //consulta al backend por datos 
            setTimeout(() => {
                navigate('/conversations')
            }, 3000)
            
        } catch (error) {
            setError(true);
        }

    }, [navigate]);

    return (
        <>
            {/* cambiar por algo mejor */}
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
            <div className="chat-loading"></div>
        </>

    );
}

export { Loading }