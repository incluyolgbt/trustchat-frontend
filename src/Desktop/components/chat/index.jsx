import React, { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client';
import { useNavigate } from "react-router-dom";
import { ProfilePhoto } from '../../../Components/ProfilePhoto'
import { PopUp } from '../../../modals/PopUp'
import { ConnectionLost } from '../../../Components/ConnectionLost'
import { useOnLine } from '../../../Hooks/useOnLine';
import './chat.css'
import { Context } from '../../context';
import { Welcome } from '../Welcome';
export default function Chat() {

    const { num, userId, connection, socket } = React.useContext(Context);
    const { isOnline } = useOnLine();
    const [message, setMessage] = useState(''); //aqui
    const [messageId, setMessageId] = useState(''); //aquí
    const [messages, setMessages] = useState([]);
    const [userName, setUserName] = useState('');

    function msgs(msg) { //para que no se reinicie messages cada vez que se le agregue algo
        setMessages((state) => [msg, ...state]);
    }

    async function handlerSend(e) { //agrega los mensajes que yo envié
        e.preventDefault();
        console.log(socket.id)
        socket.emit('message', {
            text: message,
            from: userId,
            to: num,
            type: 'text',
            messageId: messageId,
        });
        msgs({
            text: message,
            from: userId,
            to: num,
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

            // //quizá este no va aquí y quizá es un manejador de eventos y no un effect
            // //creo que sería con dependencias []
            // console.log('Efecto mando auth por socket')
            // supabase.auth.getSession().then(data => {
            //     setUserId(data.data.session.user.id); // obtener user_id
            //     socket.emit('authenticate', {
            //         'user_id': data.data.session.user.id
            //     })
            // })

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

        (num ?
            <div className="main-container">
                <header className="chat-header-container">

                    <ProfilePhoto
                        name={userName}
                        type={"chat-info--photo--chat"} />
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
                        <ConnectionLost />
                    </PopUp>)}

            </div>
            : <Welcome />
        )
    )
}
export { Chat }
