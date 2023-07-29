import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import './Home.css';

import io from 'socket.io-client';

const socket = io("/");

function Home() {
    const defaultMessage = ['necesito que me pases la información', 'como estás', 'hola'];
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    function msgs(msg) { //para que no se reinicie messages cada vez que se le agregue algo
        setMessages((state) => [msg, ...state]);
    }

    async function handlerSubmit(e) { //agrega los mensajes que yo envié
        e.preventDefault();
        socket.emit('message', message);
        msgs({
            text: message,
            from: 'me'
        });
        setMessage('');
    };

    useEffect(() => {
        socket.on('message', msg => { // ese msg será el json recibido
            msgs({
                text: msg,
                from: socket.id
            });//agrega mensajes recibidos
        })

        return () => {
            socket.off('message')
        }
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate])

    return (
        <div className="main-container">
            <header>
                <span className="photo-username"></span>
                <span className="header-username">Daniel Martínez Cornejo</span>
                <button
                    className="header-button--logout"
                    onClick={() => supabase.auth.signOut()}>Logout</button>
            </header>
            <ul className="chat-container">
                {
                    messages.map((message, i) => (
                        <li
                            className={
                                message.from != 'me' ? "chat-container--message--recieved" : "chat-container--message"}
                            key={i}><p>{message.text}</p></li>
                    ))
                }
            </ul>
            <form
                className="type-message">
                <input
                    value={message}
                    className="type-message-editor"
                    type='text' onChange={(e) => setMessage(e.target.value)} />
                <button
                    type="submit"
                    className="type-message--button"
                    onClick={handlerSubmit}>
                    Send
                </button>
            </form>
        </div>
    );
}

export { Home };