import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import './Chat.css';
import { Context } from "../../Context";


function Chat() {
    const {
        messages,
        msgs,
        userId, 
        userName,
        socket
    } = React.useContext(Context);

    console.log(messages);
    
    const { slug } = useParams();
    const [message, setMessage] = useState(''); //aqui
    const [messageId, setMessageId] = useState(''); //aquí
    
    async function handlerSend(e) { //agrega los mensajes que yo envié
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

    const navigate = useNavigate();
    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate])

    useEffect(() => {
        socket.on('message', msg => { // ese msg será el json recibido
            msgs(msg);//agrega mensajes recibidos
            setMessageId(msg.messageId);
        })

        return () => {
            socket.off('message')
        }
    }, []);

    return (
        <div className="main-container">
            <header className="chat-header-container">
                <Link
                    className="chat-header--back"
                    to={'/conversations'}></Link>


                <span className="photo-username"></span>
                <span className="header-username">{userName}</span>
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
                    onClick={handlerSend}>
                    Send
                </button>
            </form>
        </div>
    );
}

export { Chat };