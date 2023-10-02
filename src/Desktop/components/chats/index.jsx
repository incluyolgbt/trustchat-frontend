import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../../supabase/client';
import { useLocation, Link } from 'react-router-dom';
import { useOnLine } from '../../../Hooks/useOnLine';
import { ChatsList } from './ChatsList';
import { useAuth } from '../../../Hooks/useAuth';
import './Chats.css';

function Chats() {
  const { isOnline } = useOnLine();
  const { handleLogout } = useAuth();
  const [chats, setChats] = useState([]);
  const [key, setKey] = useState(1);

  const location = useLocation();

  function chts(cht) {
    setChats(cht);
  }

  const susbscribeForChanges = () => {
    supabase
      .channel('custom-insert-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          console.log('Mensaje nuevo recibido');
          loadChatList();
          setKey(key + 1);
        }
      )
      .subscribe();
  };

  const loadChatList = async () => {
    var chatTemps = {};
    let { data, error } = await supabase.rpc('user_fetch_conv_list');
    data.map((msg) => {
      const temp = msg.contact_id;
      chatTemps[temp] = {
        name: msg.contact_name,
        text: msg.content.body ? msg.content.body : msg.content,
        direction: msg.direction,
      };
    });
    chts(chatTemps);
  };

  /** On component render **/
  useEffect(() => {
    loadChatList();
    susbscribeForChanges();
  }, []);

  return isOnline ? (
    <div key={key}>
      <header className='desktop-chats-header--container'>
        <div className='desktop-chat-header--container--options'>
          <h1 className='desktop-chats'>Chats</h1>
          <button
            className='desktop-header-button--logout'
            onClick={() => {
              handleLogout();
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <div className='chat-info'>
        <Link to={`/conversations/general`}>
          <img
            className='chat-info--photo--chatList'
            src='https://avatars.githubusercontent.com/u/142632036?s=200&v=4'
          />
          <h2 className='chat-info--user'>Incluyo general</h2>
          <p className='chat-info--message'> Hola</p>
        </Link>
      </div>

      <ul className='desktop-chats-container'>
        {<ChatsList key={key} c={chats} />}
      </ul>
    </div>
  ) : null;
}

export { Chats };
