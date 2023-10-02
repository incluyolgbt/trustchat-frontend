import { useState, useEffect, useContext } from 'react';
import { supabase } from '../../../supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { PopUp } from '../../../modals/PopUp';
import { ConnectionLost } from '../../../Components/ConnectionLost';
import { useOnLine } from '../../../Hooks/useOnLine';
import { Context } from '../../../Desktop/context';
import { FaAngleLeft } from '@react-icons/all-files/fa/FaAngleLeft';
import { Notification } from '../../../Components/Notification';
import { AuthContext } from '../../../Context/AuthContext';
import './Chat.css';

function General() {
  const { generalMsg, saveGeneralMsg } = useContext(Context);
  const { authUser, authSocket } = useContext(AuthContext);
  const { isOnline } = useOnLine();

  const [message, setMessage] = useState(''); //aqui
  const [notification, setNotification] = useState(null);

  let idTimeOut;

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

  const navigate = useNavigate();
  useEffect(() => {
    if (!supabase.auth.getSession()) {
      navigate('/login');
    }
  }, [navigate]); //Al montarlo y una vez que cabie navigate

  useEffect(() => {
    authSocket.on('message', (msg) => {
      // ese msg será el json recibido
      clearTimeout(idTimeOut);
      setNotification(msg);
      idTimeOut = setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    return () => {
      authSocket.off('message');
    };
  }, []);

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
    <div className='main-container'>
      {notification && <Notification chat={notification} general={false} />}
      <header className='chat-header-container'>
        <Link className='chat-header--back' to={'/conversations'}>
          <FaAngleLeft className='chat-header--bacl--arrow' />
        </Link>
        <img
          className='chat-info--photo--chat'
          src='https://avatars.githubusercontent.com/u/142632036?s=200&v=4'
        />
        <span className='header-username'>Incluyo general</span>
      </header>
      <ul className='chat-container'>
        {generalMsg.map((message, i) => (
          <li
            className={
              message.from != authUser.id
                ? 'chat-container--message--recieved'
                : 'chat-container--message'
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
      <form className='type-message'>
        <input
          value={message}
          className='type-message-editor'
          type='text'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type='submit'
          className='type-message--button'
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
