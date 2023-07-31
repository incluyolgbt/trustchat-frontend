import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import io from 'socket.io-client';

import './Home.css';

const socket = io("/");

function Chat() {
    const { slug } = useParams();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [messageId, setMessageId] = useState('');
    const [userId, setUserId] = useState('');

    function msgs(msg) { //para que no se reinicie messages cada vez que se le agregue algo
        setMessages((state) => [msg, ...state]);
    }

    async function handlerSubmit(e) { //agrega los mensajes que yo envié
        e.preventDefault();
        socket.emit('message', {
            text: message,
            from: userId,
            to: slug,
            type: 'text',
            messageId: messageId,
        });
        msgs({
            text: message,
            from: userId,
            to: slug,
            type: 'text',
            messageId: messageId
        });
        setMessage('');
    };

    useEffect(() => {
        socket.on('message', msg => { // ese msg será el json recibido
            msgs(msg);//agrega mensajes recibidos
            setMessageId(msg.messageId);
        })

        return () => {
            socket.off('message')
        }
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        const session = supabase.auth.getSession().then(data => {
            setUserId(data.data.session.user.id);
        })

        const conversations =
            supabase.from('messages')
                .select('*')
                .eq('contact_id', slug)
                .then(data => {
                    data.data.map((msg) => {

                        msgs(
                            {
                                text: (msg.content.body ? msg.content.body : msg.content),
                                from: (
                                    msg.direction === 'input' ? msg.contact_id : msg.user_id
                                ),
                                to: (
                                    msg.direction === 'output' ? msg.contact_id : msg.user_id
                                ),
                                type: msg.type,
                                messageId: msg.id,
                            }
                        )
                    })


                })

        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate])


    return (
        <div className="main-container">
            <header className="chat-header-container">
                <Link
                    className="chat-header--back"
                    to={'/conversations'}></Link>


                <span className="photo-username"></span>
                <span className="header-username">Daniel Martínez Cornejo</span>
            </header>
            <ul className="chat-container">
                {
                    messages.map((message, i) => (
                        <li
                            className={
                                message.from != userId ? "chat-container--message--recieved" : "chat-container--message"}
                            key={i}><p>{message.text}</p></li>
                    )
                    )
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

export { Chat };