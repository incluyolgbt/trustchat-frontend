import React, { useState, useEffect, useRef, useDeferredValue } from 'react'
import { supabase } from '../../../supabase/client';
import { useNavigate, useParams } from "react-router-dom";
import { ProfilePhoto } from '../../../Components/ProfilePhoto'
import { PopUp } from '../../../modals/PopUp'
import { ConnectionLost } from '../../../Components/ConnectionLost'
import { useOnLine } from '../../../Hooks/useOnLine';
import { Context } from '../../context';
import './chat.css'

function Chat() {

    const { userId, socket } = React.useContext(Context);
    const { slug: num } = useParams();
    const { isOnline } = useOnLine();
    const [message, setMessage] = useState(''); //aqui
    const [messageId, setMessageId] = useState(''); //aquí
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');
    const [change, setChange] = useState('enviado');
    const value = useDeferredValue(change);


    function msgs(msg) { //para que no se reinicie messages cada vez que se le agregue algo
        setMessages((state) => [msg, ...state]);
    }

    async function handlerSend(e) { //agrega los mensajes que yo envié
        e.preventDefault();
        setChange('enviando');
        if (!message) return null;
        msgs({
            text: message,
            from: userId,
            to: num,
            type: 'text',
            messageId: messageId,
        });
        socket.emit('message', {
            text: message,
            from: userId,
            to: num,
            type: 'text',
            messageId: messageId,
        }, (response) => {
            if (response.status === 200) {
                setChange('enviado');
            } else {
                setChange('error');
            }
        });
        setMessage('');
    };

    const navigate = useNavigate();
    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate]); //Al montarlo y una vez que cabie navigate

    //Todas las consultas a base de datos
    var chatTemps = {};
    useEffect(() => {
        try {
            if (!num) return () => { }; //solo ejecutalo si hay un num definido
            console.log('Efecto de consulta de DB', num);
            supabase.from('messages') //Busca los mensajes en base de datos
                .select(`
                *, 
                contacts (name
                    )
                `)
                .eq('contact_id', num)
                .then(data => {
                    if (data.error?.message || !data.data.length) return navigate('/notfound');
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

        } catch (error) {
            console.error(error)
        }

    }, [num]); // Después de montarlo y cuando cambie num
    //Este efecto depende de num por eso se le pasa como dependencia

    useEffect(() => {
        if (!num) return () => { }; //solo ejecutalo si hay un num definido
        console.log('Efecto de socket on', num);
        socket.on('message', msg => { // ese msg será el json recibido
            if (msg.from === num) {
                msgs(msg);
                setMessageId(msg.messageId);
            }
        })

        return () => { //Esto solo lo ejecuta cuando se desmonta el componente
            console.log('Efecto de socket off', num);
            socket.off('message')
        }
    }, [num]); //Después de montarlo y cada vez que cambie num

    return (
        <div className="desktop-main-container">
            <header className="desktop-chat-header-container">

                <ProfilePhoto
                    name={userName}
                    type={"desktop-chat-info--photo--chat"} />
                <span className="desktop-header-username">{userName}</span>
            </header>
            <ul
                className="desktop-chat-container">
                {
                    messages.map((message, i) => (
                        <li
                            className={
                                message.from != userId ? "desktop-chat-container--message--recieved" : "desktop-chat-container--message"}
                            key={i}>
                            <p>{message.text}</p>
                            {(messages[0] === message && message.from === userId) ? <p className='sent'>{value}</p> :
                                (message.from === userId? <p className='sent'>enviado</p>: null)}
                        </li>
                    ))
                }
            </ul>
            <form
                className="desktop-type-message">
                <input
                    value={message}
                    className="desktop-type-message-editor"
                    type='text' onChange={(e) => setMessage(e.target.value)} />
                <button
                    type="submit"
                    className="desktop-type-message--button"
                    onClick={handlerSend}>
                    Send
                </button>
            </form>

            {(isOnline ? null :
                <PopUp>
                    <ConnectionLost />
                </PopUp>)}

        </div>
    )
}
export { Chat }
