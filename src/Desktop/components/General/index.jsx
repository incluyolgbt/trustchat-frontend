import React, { useState, useEffect, useContext } from 'react';
import { PopUp } from '../../../modals/PopUp';
import { ConnectionLost } from '../../../Components/ConnectionLost';
import { useOnLine } from '../../../Hooks/useOnLine';
import { Context } from '../../context';
import { AuthContext } from '../../../Context/AuthContext';
import './chat.css';

function General() {
  const { generalMsg, saveGeneralMsg } = useContext(Context);
  const { authUser, authSocket } = useContext(AuthContext);

  const { isOnline } = useOnLine();
  const [message, setMessage] = useState(''); //aqui

  function msgs(msg) {
    //para que no se reinicie messages cada vez que se le agregue algo
    saveGeneralMsg(msg);
  }

  async function handlerSend(e) {
    //agrega los mensajes que yo envié
    e.preventDefault();
    if (!message) return null;
    authSocket.emit('general', {
      text: message,
      from: authUser.id,
      name: authUser.name,
      type: 'text',
    });

    msgs({
      text: message,
      from: authUser.id,
      name: authUser.name,
      type: 'text',
    });
    setMessage('');
  }

  useEffect(() => {
    console.log('Efecto de socket on general');
    authSocket.on('general', (msg) => {
      // ese msg será el json recibido
      saveGeneralMsg(msg);
    });

    return () => {
      //Esto solo lo ejecuta cuando se desmonta el componente
      console.log('Efecto de socket off general');
      authSocket.off('general');
    };
  }, []); //Después de montarlo y cada vez que cambie num

  return (
    <div className='desktop-main-container'>
      <header className='desktop-chat-header-container'>
        <img
          className='desktop-chat-info--photo--chat'
          src='https://avatars.githubusercontent.com/u/142632036?s=200&v=4'
        />
        <span className='desktop-header-username'>Incluyo general</span>
      </header>
      <ul className='desktop-chat-container'>
        {generalMsg.map((message, i) => (
          <li
            className={
              message.from != authUser.id
                ? 'desktop-chat-container--message--recieved'
                : 'desktop-chat-container--message'
            }
            key={i}
          >
            <p>
              {message.name}
              <br />
              {message.text}
            </p>
          </li>
        ))}
      </ul>
      <form className='desktop-type-message'>
        <input
          value={message}
          className='desktop-type-message-editor'
          type='text'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type='submit'
          className='desktop-type-message--button'
          onClick={handlerSend}
        >
          Send
        </button>
      </form>

      {isOnline ? null : (
        <PopUp>
          <ConnectionLost />
        </PopUp>
      )}
    </div>
  );
}
export { General };
