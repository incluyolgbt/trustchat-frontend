import React, { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client';
import { useNavigate, useParams } from "react-router-dom";
import { PopUp } from '../../../modals/PopUp'
import { ConnectionLost } from '../../../Components/ConnectionLost'
import { useOnLine } from '../../../Hooks/useOnLine';
import { Context } from '../../context';
import './chat.css'

function General() {

    const { userId, socket, name, generalMsg, saveGeneralMsg } = React.useContext(Context);
    const { isOnline } = useOnLine();
    const [message, setMessage] = useState(''); //aqui

    function msgs(msg) { //para que no se reinicie messages cada vez que se le agregue algo
        saveGeneralMsg(msg)
    }

    async function handlerSend(e) { //agrega los mensajes que yo envié
        e.preventDefault();
        socket.emit('general', {
            text: message,
            from: userId,
            name: name,
            type: 'text',
        });

        msgs({
            text: message,
            from: userId,
            name: name,
            type: 'text',
        });
        setMessage('');
    };

    const navigate = useNavigate();
    useEffect(() => {
        if (!supabase.auth.getSession()) {
            navigate('/login');
        }
    }, [navigate]); //Al montarlo y una vez que cabie navigate

    useEffect(() => {
        console.log('Efecto de socket on general');
        socket.on('general', msg => { // ese msg será el json recibido
            saveGeneralMsg(msg);
        })

        return () => { //Esto solo lo ejecuta cuando se desmonta el componente
            console.log('Efecto de socket off general');
            socket.off('general')
        }
    }, []); //Después de montarlo y cada vez que cambie num

    return (
        <div className="desktop-main-container">
            <header className="desktop-chat-header-container">
                <img className="chat-info--photo--chatList" src='https://avatars.githubusercontent.com/u/142632036?s=200&v=4' />
                <span className="desktop-header-username">Incluyo general</span>
            </header>
            <ul className="desktop-chat-container">
                {
                    generalMsg.map((message, i) => (
                        <li
                            className={
                                message.from != userId ? "desktop-chat-container--message--recieved" : "desktop-chat-container--message"}
                            key={i}>
                                <p>{message.name}<br/>{message.text}</p>
                                </li>
                    )
                    )
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
export { General }
