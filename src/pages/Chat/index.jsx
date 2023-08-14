import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { Context } from "../../Context";
import { ProfilePhoto } from "../../Components/ProfilePhoto";
import {FaAngleLeft} from '@react-icons/all-files/fa/FaAngleLeft';
import { PopUp } from "../../modals/PopUp";
import { ConnectionLost } from "../../Components/ConnectionLost";
import { useOnLine } from "../../Hooks/useOnLine";
import './Chat.css';
import { Notification } from "./Notification";


function Chat() {
    const {
        userId,
        socket,
        setUserId
    } = React.useContext(Context);

    const {isOnline} = useOnLine();

    const { slug } = useParams();
    const [message, setMessage] = useState(''); //aqui
    const [messageId, setMessageId] = useState(''); //aquí
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [notification, setNotification] = useState(null);

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
            // supabase.from('contacts').select('*').eq('wa_num', slug).then(data => {
            //     setUserName(data.data[0].name)
            // })

            supabase.from('messages') //Busca los mensajes en base de datos
                .select(`
                *, 
                contacts (name
                    )
                `)
                .eq('contact_id', slug)
                .then(data => {
                    if (data.data.length === 0) return navigate('/notfound');
                    setUserName(data.data[0].contacts.name)
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
                socket.emit('authenticate', {
                    'user_id': data.data.session.user.id
                })
            })



        } catch (error) {
            console.error(error)
        }

    }, [navigate])

    useEffect(() => {

        socket.on('message', msg => { // ese msg será el json recibido
            (msg.from === slug ? msgs(msg): setNotification(msg)) //Aquí abrir vaul 
            setMessageId(msg.messageId);
        })

        return () => {
            socket.off('message')
        }
    }, []);

    return (
        <div className="main-container">
            {(notification && <Notification chat={notification}/>)}
            <header className="chat-header-container">
                <Link
                    className="chat-header--back"
                    to={'/conversations'}>
                    <FaAngleLeft className="chat-header--bacl--arrow"/>
                </Link>


                <ProfilePhoto 
                name={userName}
                type={"chat-info--photo--chat"}/>
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

            {(isOnline ? null :
                <PopUp>
                    <ConnectionLost/>
                </PopUp>)}

        </div>
    );
}

export { Chat };