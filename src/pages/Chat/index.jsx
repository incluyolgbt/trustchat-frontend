import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import './Chat.css';
import { Context } from "../../Context";


function Chat() {
    const {
        userId,
        userName,
        socket,
        setUserName,
        setUserId
    } = React.useContext(Context);

    const { slug } = useParams();
    const [message, setMessage] = useState(''); //aqui
    const [messageId, setMessageId] = useState(''); //aquí
    const [messages, setMessages] = useState([]);
    function msgs(msg) { //para que no se reinicie messages cada vez que se le agregue algo
        setMessages((state) => [msg, ...state]);
    }

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

    //Todas las consultas a base de datos
    var chatTemps = {};
    useEffect(() => {
        try {
            supabase.from('contacts').select('*').eq('wa_num', slug).then(data => {
                setUserName(data.data[0].name)
            })

            supabase.from('messages') //Busca los mensajes en base de datos
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

            supabase.auth.getSession().then(data => {
                setUserId(data.data.session.user.id); // obtener user_id
            })
            
        } catch (error) {
            console.error(error)
        }

    }, [navigate])

    useEffect(() => {
        socket.on('message', msg => { // ese msg será el json recibido
            (msg.from === slug ? msgs(msg): '')
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