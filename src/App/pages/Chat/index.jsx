import { useState, useEffect, useDeferredValue, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../../supabase/client';
import { Context } from '../../../Desktop/context';
import { Context as GlobalContext } from './../../../Context/';
import { ProfilePhoto } from '../../../Components/ProfilePhoto';
import { FaAngleLeft } from '@react-icons/all-files/fa/FaAngleLeft';
import { PopUp } from '../../../modals/PopUp';
import { ConnectionLost } from '../../../Components/ConnectionLost';
import { useOnLine } from '../../../Hooks/useOnLine';
import { Notification } from '../../../Components/Notification';
import { AuthContext } from '../../../Context/AuthContext';
import './Chat.css';

function Chat() {
  const { saveGeneralMsg } = useContext(Context);
  const { setLoading } = useContext(GlobalContext);
  const { authUser, authSocket } = useContext(AuthContext);

  const { isOnline } = useOnLine();
  const { slug } = useParams();

  const [message, setMessage] = useState(''); //aqui
  const [messageId, setMessageId] = useState(''); //aquí
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const [notification, setNotification] = useState(null);
  const [general, setGeneral] = useState(false);
  const [change, setChange] = useState('enviado');
  const value = useDeferredValue(change);

  let idTimeOut;

  function msgs(msg) {
    //para que no se reinicie messages cada vez que se le agregue algo
    setMessages((state) => [msg, ...state]);
  }

  async function handlerSend(e) {
    //agrega los mensajes que yo envié
    e.preventDefault();
    setChange('enviando');
    if (!message) return null;
    msgs({
      text: message,
      from: authUser.id,
      to: slug,
      type: 'text',
      messageId: messageId,
    });
    authSocket.emit(
      'message',
      {
        text: message,
        from: authUser.id,
        to: slug,
        type: 'text',
        messageId: messageId,
      },
      (response) => {
        if (response.status === 200) {
          setChange('enviado');
        } else {
          setChange('error');
        }
      }
    );
    setMessage('');
  }

  //Todas las consultas a base de datos
  var chatTemps = {};
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      await supabase
        .from('messages') //Busca los mensajes en base de datos
        .select(`*, contacts (name)`)
        .eq('contact_id', slug)
        .then((data) => {
          if (data.error?.message || !data.data.length)
            return navigate('/notfound');
          setUserName(data.data[0].contacts.name);
          data.data.map((msg) => {
            msgs({
              text: msg.content.body ? msg.content.body : msg.content,
              from: msg.direction === 'input' ? msg.contact_id : msg.user_id,
              to: msg.direction === 'output' ? msg.contact_id : msg.user_id,
              type: msg.type,
              messageId: msg.id,
            });
          });
        });
      setLoading(false);
    };
    loadMessages();
  }, []);

  useEffect(() => {
    authSocket.on('message', (msg) => {
      // ese msg será el json recibido
      if (msg.from === slug) {
        msgs(msg);
        setMessageId(msg.messageId);
      } else {
        setGeneral(false);
        clearTimeout(idTimeOut);
        setNotification(msg);
        idTimeOut = setTimeout(() => {
          setNotification(null);
        }, 5000);
      }
    });

    return () => {
      authSocket.off('message');
    };
  }, []);

  useEffect(() => {
    authSocket.on('general', (msg) => {
      // ese msg será el json recibido
      saveGeneralMsg(msg); //Aquí tengo que pone el setMSG
      clearTimeout(idTimeOut);
      setNotification(msg);
      setGeneral(true);
      idTimeOut = setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    return () => {
      authSocket.off('general');
    };
  }, []);

  return (
    <div className='main-container'>
      {notification && <Notification chat={notification} general={general} />}
      <header className='chat-header-container'>
        <Link className='chat-header--back' to={'/conversations'}>
          <FaAngleLeft className='chat-header--bacl--arrow' />
        </Link>

        <ProfilePhoto name={userName} type={'chat-info--photo--chat'} />
        <span className='header-username'>{userName}</span>
      </header>
      <ul className='chat-container'>
        {messages.map((message, i) => (
          <li
            className={
              message.from != authUser.id
                ? 'chat-container--message--recieved'
                : 'chat-container--message'
            }
            key={i}
          >
            <p>{message.text}</p>
            {/* Si el mensaje es el último y yo lo envío coloca value, si solo lo envié yo pero no es el último coloca enviado */}
            {messages[0] === message && message.from === authUser.id ? (
              <p className='sent'>{value}</p>
            ) : message.from === authUser.id ? (
              <p className='sent'>enviado</p>
            ) : null}
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

export { Chat };
